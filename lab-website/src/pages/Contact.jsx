import { useState } from 'react'
import { useLabData } from '../context/LabDataContext'
import { api } from '../api'

const TYPO_DOMAINS = {
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
}

function checkEmailSyntax(email) {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email address is required.' }
  }
  const trimmed = email.trim()
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  if (!regex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address (e.g. name@example.com).' }
  }
  const parts = trimmed.split('@')
  if (parts.length !== 2) {
    return { valid: false, error: 'Please enter a valid email address.' }
  }
  const domain = parts[1].toLowerCase()
  const tld = domain.split('.').pop()
  if (!tld || tld.length < 2) {
    return { valid: false, error: 'Email domain extension must be valid (e.g. .com, .edu, .org).' }
  }
  let suggestion = null
  if (TYPO_DOMAINS[domain]) {
    suggestion = `${parts[0]}@${TYPO_DOMAINS[domain]}`
  }
  return { valid: true, error: null, suggestion }
}

export default function Contact() {
  const { labInfo } = useLabData()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidatingEmail, setIsValidatingEmail] = useState(false)
  const [submissionInfo, setSubmissionInfo] = useState(null)
  const [emailError, setEmailError] = useState('')
  const [emailSuggestion, setEmailSuggestion] = useState(null)
  const [nameError, setNameError] = useState('')
  const [messageError, setMessageError] = useState('')
  const [generalError, setGeneralError] = useState('')

  // Target recipients logic:
  // - If an alternate email is mentioned, the mail will go to BOTH mail IDs.
  // - If no alternate email is mentioned, it will go ONLY to the 1st email ID.
  const primaryEmail = (labInfo.email || '').trim()
  const alternateEmail = (labInfo.alternateEmail || '').trim()

  const targetRecipients = []
  if (primaryEmail) targetRecipients.push(primaryEmail)
  if (alternateEmail) targetRecipients.push(alternateEmail)
  if (targetRecipients.length === 0) targetRecipients.push('pi@university.edu')

  const handleEmailBlur = async () => {
    const emailVal = form.email.trim()
    if (!emailVal) return
    const syntax = checkEmailSyntax(emailVal)
    if (!syntax.valid) {
      setEmailError(syntax.error)
      setEmailSuggestion(null)
      return
    }
    setEmailError('')
    setEmailSuggestion(syntax.suggestion)

    // Check domain existence via backend
    try {
      setIsValidatingEmail(true)
      const res = await api.validateEmail(emailVal)
      if (!res.valid) {
        setEmailError(res.message)
      } else {
        setEmailError('')
      }
    } catch {
      // ignore network errors on blur
    } finally {
      setIsValidatingEmail(false)
    }
  }

  const handleEmailChange = (e) => {
    const val = e.target.value
    setForm(f => ({ ...f, email: val }))
    if (emailError) {
      const syntax = checkEmailSyntax(val)
      if (syntax.valid) {
        setEmailError('')
        setEmailSuggestion(syntax.suggestion)
      }
    }
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setGeneralError('')

    let hasError = false
    if (!form.name.trim()) {
      setNameError('Please enter your full name.')
      hasError = true
    } else {
      setNameError('')
    }

    const emailCheck = checkEmailSyntax(form.email)
    if (!emailCheck.valid) {
      setEmailError(emailCheck.error)
      hasError = true
    } else {
      setEmailError('')
    }

    if (!form.message.trim()) {
      setMessageError('Please enter your message.')
      hasError = true
    } else {
      setMessageError('')
    }

    if (hasError) return

    setIsSubmitting(true)

    // Save message to backend database
    try {
      await api.sendMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        recipients: targetRecipients
      })

      // Display confirmation status
      setSubmissionInfo({
        recipients: targetRecipients,
        senderName: form.name.trim()
      })
      setSent(true)
      setEmailError('')
      setEmailSuggestion(null)
    } catch (err) {
      console.warn('Backend message save notice:', err)
      const errMsg = err.message || 'Failed to send message.'
      if (errMsg.toLowerCase().includes('email') || errMsg.toLowerCase().includes('domain')) {
        setEmailError(errMsg)
      } else {
        setGeneralError(errMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <main style={{ paddingTop: '70px' }}>
      <section style={{ background: 'var(--navy)', padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff' }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem' }}>We'd love to hear from you</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem' }}>
            {/* Info */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>Get in Touch</h2>
              
              {/* Email */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', background: 'var(--gray-100)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  📧
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 600, marginBottom: '0.15rem' }}>Email</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--gray-700)', wordBreak: 'break-word' }}>
                    {labInfo.email && (
                      <a 
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(labInfo.email)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: 'var(--blue)' }}
                        title="Click to compose in Gmail"
                      >
                        {labInfo.email}
                      </a>
                    )}
                    {labInfo.alternateEmail && labInfo.alternateEmail.trim() ? (
                      <>
                        <span style={{ color: 'var(--gray-500)', margin: '0 0.45rem' }}>/</span>
                        <a 
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(labInfo.alternateEmail)}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: 'var(--blue)' }}
                          title="Click to compose in Gmail"
                        >
                          {labInfo.alternateEmail}
                        </a>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', background: 'var(--gray-100)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  📞
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 600, marginBottom: '0.15rem' }}>Phone</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--gray-700)' }}>
                    {labInfo.phone && <span>{labInfo.phone}</span>}
                    {labInfo.alternatePhone && labInfo.alternatePhone.trim() ? (
                      <>
                        <span style={{ color: 'var(--gray-500)', margin: '0 0.45rem' }}>/</span>
                        <span>{labInfo.alternatePhone}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', background: 'var(--gray-100)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  📍
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 600, marginBottom: '0.15rem' }}>Address</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--gray-700)', lineHeight: 1.5 }}>
                    {labInfo.address || 'Newtown Kolkata'}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#fef3c7', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--gold)' }}>
                <p style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: 600, marginBottom: '0.35rem' }}>🎓 Prospective Students</p>
                <p style={{ fontSize: '0.85rem', color: '#78350f' }}>
                  Research scholar and student positions are available. Please send your CV, research statement, and two references to{' '}
                  <a 
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetRecipients.join(','))}&su=${encodeURIComponent('Prospective Student Inquiry')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#92400e', fontWeight: 600, textDecoration: 'underline' }}
                    title="Click to compose in Gmail"
                  >
                    {labInfo.email}
                    {labInfo.alternateEmail && labInfo.alternateEmail.trim() ? ` or ${labInfo.alternateEmail}` : ''}
                  </a>
                </p>
              </div>
            </div>

            {/* Form */}
            <div>
              {sent ? (
                <div style={{
                  padding: '3rem 2rem',
                  background: '#f0fdf4',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #bbf7d0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3.2rem', marginBottom: '0.75rem' }}>✅</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', color: '#166534', fontSize: '1.6rem', marginBottom: '1.75rem' }}>
                    Your Message has been successfully delivered!
                  </h3>
                  <div>
                    <button
                      onClick={() => {
                        setForm({ name: '', email: '', subject: '', message: '' })
                        setSent(false)
                        setSubmissionInfo(null)
                      }}
                      className="btn btn-primary"
                      style={{ fontSize: '0.95rem', padding: '0.75rem 1.75rem' }}
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {generalError && (
                    <div style={{
                      padding: '0.85rem 1rem',
                      background: '#fee2e2',
                      border: '1px solid #fca5a5',
                      borderRadius: '8px',
                      color: '#b91c1c',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>⚠️</span>
                      <span>{generalError}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={form.name}
                      onChange={e => {
                        setForm(f => ({ ...f, name: e.target.value }))
                        if (nameError) setNameError('')
                      }}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: nameError ? '1.5px solid #ef4444' : '1px solid var(--gray-200)',
                        background: nameError ? '#fff5f5' : '#fff',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border 0.2s ease, background 0.2s ease'
                      }}
                    />
                    {nameError && (
                      <div style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '0.35rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>⚠️</span> {nameError}
                      </div>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)' }}>
                        Email Address *
                      </label>
                      {isValidatingEmail && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--blue)', fontWeight: 500 }}>
                          Checking domain...
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      placeholder="e.g. student@amity.edu or name@gmail.com"
                      value={form.email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: emailError ? '1.5px solid #ef4444' : '1px solid var(--gray-200)',
                        background: emailError ? '#fff5f5' : '#fff',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border 0.2s ease, background 0.2s ease'
                      }}
                    />
                    
                    {/* Error display */}
                    {emailError && (
                      <div style={{
                        color: '#dc2626',
                        fontSize: '0.83rem',
                        marginTop: '0.4rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.35rem',
                        lineHeight: 1.4
                      }}>
                        <span style={{ flexShrink: 0 }}>⚠️</span>
                        <span>{emailError}</span>
                      </div>
                    )}

                    {/* Typo suggestion */}
                    {emailSuggestion && !emailError && (
                      <div style={{
                        marginTop: '0.45rem',
                        padding: '0.45rem 0.75rem',
                        background: '#fef3c7',
                        border: '1px solid #fde68a',
                        borderRadius: '6px',
                        fontSize: '0.83rem',
                        color: '#92400e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        <span>💡 Did you mean <strong>{emailSuggestion}</strong>?</span>
                        <button
                          type="button"
                          onClick={() => {
                            setForm(f => ({ ...f, email: emailSuggestion }))
                            setEmailSuggestion(null)
                            setEmailError('')
                          }}
                          style={{
                            background: '#d97706',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.2rem 0.55rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Use suggestion
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Research Inquiry, Ph.D. Position"
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--gray-200)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '0.4rem' }}>
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={e => {
                        setForm(f => ({ ...f, message: e.target.value }))
                        if (messageError) setMessageError('')
                      }}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        border: messageError ? '1.5px solid #ef4444' : '1px solid var(--gray-200)',
                        background: messageError ? '#fff5f5' : '#fff',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border 0.2s ease, background 0.2s ease'
                      }}
                    />
                    {messageError && (
                      <div style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '0.35rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>⚠️</span> {messageError}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleSubmit} 
                    className="btn btn-primary" 
                    style={{ alignSelf: 'flex-start', minWidth: '150px' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Verifying & Sending...' : 'Send Message →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
