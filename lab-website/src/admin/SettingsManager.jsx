import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLabData } from '../context/LabDataContext'
import { useConfirm } from '../context/ConfirmModalContext'

const inputStyle = { 
  width: '100%', 
  padding: '0.65rem 0.9rem', 
  border: '1px solid var(--gray-200)', 
  borderRadius: '6px', 
  fontFamily: 'var(--font-body)', 
  fontSize: '0.9rem', 
  boxSizing: 'border-box' 
}

const labelStyle = { 
  fontSize: '0.82rem', 
  fontWeight: 600, 
  color: 'var(--navy)', 
  display: 'block', 
  marginBottom: '0.35rem' 
}

const helperStyle = { 
  fontSize: '0.75rem', 
  color: 'var(--gray-500)', 
  marginTop: '0.3rem', 
  display: 'block' 
}

const sectionBox = { 
  background: '#fff', 
  border: '1px solid var(--gray-200)', 
  borderRadius: '10px', 
  padding: '1.75rem', 
  marginBottom: '1.75rem' 
}

export default function SettingsManager() {
  const { changePassword } = useAuth()
  const { piInfo, updateProfile, labInfo, updateContact, updateAbout, dbConnected } = useLabData()
  const confirm = useConfirm()

  // Profile State (Left Column)
  const [profileName, setProfileName] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('/pi-photo.png')
  const [profileTitle, setProfileTitle] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileStatus, setProfileStatus] = useState(null)

  // Favicon State (Left Column)
  const [favIcon, setFavIcon] = useState('/fav.png')
  const [isSavingFav, setIsSavingFav] = useState(false)
  const [favStatus, setFavStatus] = useState(null)

  // Password State (Left Column)
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [pwdStatus, setPwdStatus] = useState(null)

  // Contact State (Right Column)
  const [contact, setContact] = useState({
    email: '',
    alternateEmail: '',
    phone: '',
    alternatePhone: '',
    address: ''
  })
  const [isSavingContact, setIsSavingContact] = useState(false)
  const [contactStatus, setContactStatus] = useState(null)

  // Load Favicon from Context
  useEffect(() => {
    if (labInfo) {
      setFavIcon(labInfo.favicon || '/fav.png')
    }
  }, [labInfo])

  // Load Profile from Context
  useEffect(() => {
    if (piInfo) {
      if (piInfo.name && !piInfo.name.includes('Your Name')) {
        setProfileName(piInfo.name)
      } else {
        setProfileName('Debabrata Maity')
      }
      setProfilePhoto(piInfo.photo || '/pi-photo.png')
      setProfileTitle(piInfo.title || 'Principal Investigator')
    }
  }, [piInfo])

  // Load Contact from Context
  useEffect(() => {
    if (labInfo) {
      setContact({
        email: labInfo.email || '',
        alternateEmail: labInfo.alternateEmail || '',
        phone: labInfo.phone || '',
        alternatePhone: labInfo.alternatePhone || '',
        address: labInfo.address || ''
      })
    }
  }, [labInfo])

  // Handle Photo File Upload with Canvas Optimization
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 800
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88)
        setProfilePhoto(optimizedDataUrl)
        setProfileStatus({ 
          type: 'info', 
          message: '📷 New photo loaded. Click "Save Profile & Sync to Database" below to apply.' 
        })
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // Save Profile to Database
  const handleSaveProfile = async () => {
    setIsSavingProfile(true)
    setProfileStatus(null)
    try {
      const updatedData = {
        name: profileName.trim() || 'Debabrata Maity',
        photo: profilePhoto,
        title: profileTitle.trim() || 'Principal Investigator'
      }

      await updateProfile(updatedData)
      setProfileStatus({ 
        type: 'success', 
        message: dbConnected 
          ? '✅ Profile photo & homepage name saved and synced with Firebase Firestore!' 
          : '✅ Profile updated and saved locally! (Backend server offline)'
      })
      setTimeout(() => setProfileStatus(null), 6000)
    } catch (err) {
      console.error('Error saving profile:', err)
      setProfileStatus({ 
        type: 'error', 
        message: `⚠️ Saved locally, but database sync error: ${err.message}` 
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Save Contact Details to Database
  const handleSaveContact = async () => {
    setIsSavingContact(true)
    setContactStatus(null)
    try {
      const updatedContact = {
        email: contact.email.trim(),
        alternateEmail: contact.alternateEmail.trim(),
        phone: contact.phone.trim(),
        alternatePhone: contact.alternatePhone.trim(),
        address: contact.address.trim()
      }

      await updateContact(updatedContact)
      setContactStatus({
        type: 'success',
        message: dbConnected
          ? '✅ Contact details saved and synced with Firebase Firestore!'
          : '✅ Contact details saved locally! (Backend server offline)'
      })
      setTimeout(() => setContactStatus(null), 6000)
    } catch (err) {
      console.error('Error saving contact:', err)
      setContactStatus({
        type: 'error',
        message: `⚠️ Saved locally, but database sync error: ${err.message}`
      })
    } finally {
      setIsSavingContact(false)
    }
  }

  // Handle Favicon File Upload with Canvas Optimization
  const handleFaviconUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const targetDim = 128
        const canvas = document.createElement('canvas')
        canvas.width = targetDim
        canvas.height = targetDim
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, targetDim, targetDim)
        ctx.drawImage(img, 0, 0, targetDim, targetDim)

        const optimizedDataUrl = canvas.toDataURL('image/png')
        setFavIcon(optimizedDataUrl)
        setFavStatus({
          type: 'info',
          message: '✨ New favicon chosen. Click "Save Favicon" below to apply it across the website.'
        })
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // Save Favicon
  const handleSaveFavicon = async () => {
    setIsSavingFav(true)
    setFavStatus(null)
    try {
      if (updateAbout) {
        const { email, alternateEmail, phone, alternatePhone, address, ...cleanLabInfo } = labInfo
        await updateAbout({
          ...cleanLabInfo,
          favicon: favIcon
        })
      }
      setFavStatus({
        type: 'success',
        message: '✅ Favicon saved and updated in the browser tab!'
      })
      setTimeout(() => setFavStatus(null), 5000)
    } catch (err) {
      console.error('Error saving favicon:', err)
      setFavStatus({
        type: 'error',
        message: `⚠️ Saved locally, but database sync error: ${err.message}`
      })
    } finally {
      setIsSavingFav(false)
    }
  }

  // Delete / Reset Favicon
  const handleDeleteFavicon = async () => {
    const ok = await confirm({
      title: 'Reset Favicon to Default?',
      message: 'Do you want to delete the custom favicon and restore the default lab favicon (/fav.png)?',
      confirmText: 'Yes, Reset',
      cancelText: 'No',
      danger: true
    })
    if (!ok) return

    setIsSavingFav(true)
    setFavStatus(null)
    try {
      setFavIcon('/fav.png')
      if (updateAbout) {
        const { email, alternateEmail, phone, alternatePhone, address, ...cleanLabInfo } = labInfo
        await updateAbout({
          ...cleanLabInfo,
          favicon: '/fav.png'
        })
      }
      setFavStatus({
        type: 'success',
        message: '✅ Favicon reset to default (/fav.png).'
      })
      setTimeout(() => setFavStatus(null), 5000)
    } catch (err) {
      console.error('Error resetting favicon:', err)
      setFavStatus({
        type: 'error',
        message: `⚠️ Error resetting favicon: ${err.message}`
      })
    } finally {
      setIsSavingFav(false)
    }
  }

  // Password Update
  const handlePasswordUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      setPwdStatus('mismatch')
      return
    }
    const success = changePassword(passwords.current, passwords.new)
    if (success) {
      setPwdStatus('success')
      setPasswords({ current: '', new: '', confirm: '' })
      setTimeout(() => setPwdStatus(null), 3000)
    } else {
      setPwdStatus('error')
    }
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', 
      gap: '1.75rem', 
      alignItems: 'start',
      maxWidth: '1280px' 
    }}>
      {/* ── LEFT COLUMN: HERO PROFILE & PASSWORD ── */}
      <div>
        {/* Profile Card */}
        <div style={sectionBox}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>
                Homepage Hero Profile & Photo
              </h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)', margin: 0 }}>
                Update the photo and name badge in the circular hero section.
              </p>
            </div>
            <span style={{ 
              fontSize: '0.72rem', 
              padding: '0.25rem 0.6rem', 
              borderRadius: '20px', 
              background: dbConnected ? '#dcfce7' : '#fee2e2',
              color: dbConnected ? '#166534' : '#b91c1c',
              fontWeight: 600
            }}>
              {dbConnected ? '🔥 Firebase Connected' : '⚠️ Offline'}
            </span>
          </div>

          {profileStatus && (
            <div style={{ 
              marginBottom: '1.25rem', 
              padding: '0.75rem 1rem', 
              borderRadius: '7px', 
              fontSize: '0.86rem',
              background: profileStatus.type === 'success' ? '#dcfce7' : profileStatus.type === 'info' ? '#e0f2fe' : '#fee2e2',
              color: profileStatus.type === 'success' ? '#166534' : profileStatus.type === 'info' ? '#0369a1' : '#b91c1c'
            }}>
              {profileStatus.message}
            </div>
          )}

          {/* Live Hero Preview Box */}
          <div style={{
            background: 'linear-gradient(135deg, var(--navy) 0%, #162a45 60%, #0f3460 100%)',
            padding: '1.75rem 1.25rem',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '1.5rem',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 6px 20px rgba(13,27,42,0.18)'
          }}>
            <div style={{ 
              fontSize: '0.72rem', 
              color: 'var(--gold-light)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              marginBottom: '1.2rem', 
              fontWeight: 600 
            }}>
              ✦ Live Homepage Preview
            </div>

            {/* Photo Frame */}
            <div style={{
              position: 'relative',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              padding: '5px',
              background: 'linear-gradient(135deg, var(--gold) 0%, rgba(201,168,76,0.3) 50%, var(--gold) 100%)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5), 0 0 25px rgba(201,168,76,0.3)',
            }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                overflow: 'hidden', 
                background: 'var(--navy-mid)' 
              }}>
                <img 
                  src={profilePhoto} 
                  alt="Profile Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  onError={(e) => { e.target.src = '/pi-photo.png' }}
                />
              </div>

              {/* Floating PI Badge */}
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(10, 25, 47, 0.95)',
                border: '1px solid rgba(201, 168, 76, 0.5)',
                padding: '0.35rem 0.95rem',
                borderRadius: '20px',
                color: '#fff',
                whiteSpace: 'nowrap',
                fontSize: '0.8rem',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>✦</span>
                <span>{profileName || 'Debabrata Maity'}</span>
              </div>
            </div>
          </div>

          {/* Photo Upload Controls */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label style={{
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.55rem 1.1rem', 
              borderRadius: '7px', 
              cursor: 'pointer',
              background: 'var(--navy)', 
              color: '#fff', 
              fontSize: '0.85rem', 
              fontFamily: 'var(--font-body)',
              fontWeight: 500
            }}>
              📁 Choose New Photo
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
            </label>

            <button 
              type="button"
              onClick={() => setProfilePhoto('/pi-photo.png')}
              style={{ 
                padding: '0.55rem 0.9rem', 
                border: '1px solid var(--gray-200)', 
                borderRadius: '7px', 
                background: '#fff', 
                color: 'var(--gray-700)', 
                cursor: 'pointer', 
                fontSize: '0.82rem' 
              }}
            >
              ↺ Reset to pi-photo.png
            </button>
          </div>

          {/* Profile Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Name on Homepage Image Badge</label>
              <input 
                type="text" 
                value={profileName} 
                onChange={e => setProfileName(e.target.value)} 
                placeholder="e.g. Debabrata Maity" 
                style={inputStyle} 
              />
              <span style={helperStyle}>
                This is the name rendered directly underneath your circular photo on the homepage hero section.
              </span>
            </div>

            <div>
              <label style={labelStyle}>Designation / Role</label>
              <input 
                type="text" 
                value={profileTitle} 
                onChange={e => setProfileTitle(e.target.value)} 
                placeholder="e.g. Principal Investigator & Assistant Professor" 
                style={inputStyle} 
              />
              <span style={helperStyle}>
                Shown on the About page and lab profile listings.
              </span>
            </div>

            <div style={{ paddingTop: '0.5rem' }}>
              <button 
                onClick={handleSaveProfile} 
                disabled={isSavingProfile}
                className="btn btn-primary" 
                style={{ alignSelf: 'flex-start' }}
              >
                {isSavingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Favicon Card */}
        <div style={sectionBox}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>
                Website Favicon (Browser Tab Icon)
              </h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)', margin: 0 }}>
                Icon displayed on visitor browser tabs and bookmarks.
              </p>
            </div>
            <span style={{ 
              fontSize: '0.72rem', 
              padding: '0.25rem 0.6rem', 
              borderRadius: '20px', 
              background: favIcon === '/fav.png' ? '#f1f5f9' : '#dbeafe',
              color: favIcon === '/fav.png' ? 'var(--gray-600)' : '#1e40af',
              fontWeight: 600
            }}>
              {favIcon === '/fav.png' ? 'Default /fav.png' : 'Custom Favicon'}
            </span>
          </div>

          {favStatus && (
            <div style={{ 
              marginBottom: '1.25rem', 
              padding: '0.75rem 1rem', 
              borderRadius: '7px', 
              fontSize: '0.86rem',
              background: favStatus.type === 'success' ? '#dcfce7' : favStatus.type === 'info' ? '#e0f2fe' : '#fee2e2',
              color: favStatus.type === 'success' ? '#166534' : favStatus.type === 'info' ? '#0369a1' : '#b91c1c'
            }}>
              {favStatus.message}
            </div>
          )}

          {/* Browser Tab Simulation Preview */}
          <div style={{
            background: '#1e293b',
            borderRadius: '8px 8px 0 0',
            padding: '0.65rem 0.85rem 0',
            marginBottom: '1.25rem',
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>
              ✦ BROWSER TAB PREVIEW
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              background: '#0f172a',
              borderRadius: '8px 8px 0 0',
              padding: '0.45rem 0.85rem',
              maxWidth: '280px',
              color: '#f8fafc',
              fontSize: '0.82rem',
              borderTop: '2px solid var(--gold-light)'
            }}>
              <img
                src={favIcon}
                alt="Favicon preview"
                style={{ width: '18px', height: '18px', borderRadius: '3px', objectFit: 'contain' }}
                onError={(e) => { e.target.src = '/fav.png' }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {labInfo?.name || 'Debarata Lab'} | {labInfo?.university || 'Amity University'}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b', cursor: 'default' }}>✕</span>
            </div>
          </div>

          {/* Favicon Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '12px',
              border: '2px solid var(--gray-200)',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              flexShrink: 0
            }}>
              <img
                src={favIcon}
                alt="Favicon"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                onError={(e) => { e.target.src = '/fav.png' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <label style={{
                  padding: '0.48rem 0.95rem',
                  borderRadius: '6px',
                  border: '1px solid var(--gray-300)',
                  backgroundColor: '#ffffff',
                  color: 'var(--navy)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s'
                }}>
                  📁 Choose Favicon Image
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml, image/x-icon, image/webp"
                    onChange={handleFaviconUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                {favIcon !== '/fav.png' && (
                  <button
                    type="button"
                    onClick={handleDeleteFavicon}
                    disabled={isSavingFav}
                    style={{
                      padding: '0.48rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #fee2e2',
                      backgroundColor: '#fff',
                      color: '#dc2626',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s'
                    }}
                  >
                    🗑️ Reset to Default
                  </button>
                )}
              </div>
              <span style={helperStyle}>
                Supports PNG, ICO, SVG, or JPG. Recommended: 64×64 or 128×128 square image.
              </span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleSaveFavicon}
              disabled={isSavingFav}
              className="btn btn-primary"
              style={{ fontSize: '0.86rem', padding: '0.55rem 1.25rem' }}
            >
              {isSavingFav ? 'Saving Favicon...' : 'Save Favicon'}
            </button>
          </div>
        </div>

        {/* Password Card */}
        <div style={sectionBox}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: '1.25rem', fontSize: '1.15rem' }}>
            Change Admin Password
          </h3>
          
          {pwdStatus === 'success' && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.85rem' }}>
              ✅ Password successfully updated.
            </div>
          )}
          {pwdStatus === 'error' && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.85rem' }}>
              ❌ Incorrect current password.
            </div>
          )}
          {pwdStatus === 'mismatch' && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.85rem' }}>
              ❌ New passwords do not match.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input 
                type="password" 
                value={passwords.current} 
                onChange={e => setPasswords({ ...passwords, current: e.target.value })} 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input 
                type="password" 
                value={passwords.new} 
                onChange={e => setPasswords({ ...passwords, new: e.target.value })} 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input 
                type="password" 
                value={passwords.confirm} 
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} 
                style={inputStyle} 
              />
            </div>
            <button 
              onClick={handlePasswordUpdate} 
              className="btn btn-primary" 
              style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
            >
              Save Password
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: CONTACT & "GET IN TOUCH" DETAILS ── */}
      <div>
        <div style={sectionBox}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: '1.2rem', marginBottom: '0.2rem' }}>
                Contact & "Get in Touch" Details
              </h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)', margin: 0 }}>
                Synced directly with the Contact Us page and website footer.
              </p>
            </div>
            <span style={{ 
              fontSize: '0.72rem', 
              padding: '0.25rem 0.6rem', 
              borderRadius: '20px', 
              background: dbConnected ? '#dcfce7' : '#fee2e2',
              color: dbConnected ? '#166534' : '#b91c1c',
              fontWeight: 600
            }}>
              {dbConnected ? '🔥 Firebase Connected' : '⚠️ Offline'}
            </span>
          </div>

          {contactStatus && (
            <div style={{ 
              marginBottom: '1.25rem', 
              padding: '0.75rem 1rem', 
              borderRadius: '7px', 
              fontSize: '0.86rem',
              background: contactStatus.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: contactStatus.type === 'success' ? '#166534' : '#b91c1c'
            }}>
              {contactStatus.message}
            </div>
          )}

          {/* Live Mini Contact Preview Card */}
          <div style={{
            background: 'var(--off-white)',
            border: '1px solid var(--gray-200)',
            borderRadius: '10px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ 
              fontSize: '0.72rem', 
              color: 'var(--navy-mid)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              marginBottom: '0.9rem', 
              fontWeight: 700 
            }}>
              ✦ Contact Page Preview ("Get in Touch")
            </div>

            {/* Email Preview */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.1rem' }}>📧</span>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', fontWeight: 600 }}>Email</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--blue)', fontWeight: 500, wordBreak: 'break-word' }}>
                  <span>{contact.email || 'pi@university.edu'}</span>
                  {contact.alternateEmail && contact.alternateEmail.trim() ? (
                    <>
                      <span style={{ color: 'var(--gray-500)', margin: '0 0.35rem' }}>/</span>
                      <span>{contact.alternateEmail.trim()}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Phone Preview */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.1rem' }}>📞</span>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', fontWeight: 600 }}>Phone</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--gray-700)', fontWeight: 500 }}>
                  <span>{contact.phone || '+91 33 XXXX XXXX'}</span>
                  {contact.alternatePhone && contact.alternatePhone.trim() ? (
                    <>
                      <span style={{ color: 'var(--gray-500)', margin: '0 0.35rem' }}>/</span>
                      <span>{contact.alternatePhone.trim()}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Address Preview */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.1rem' }}>📍</span>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', fontWeight: 600 }}>Address</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-700)', lineHeight: 1.4 }}>
                  {contact.address || 'Newtown Kolkata'}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Primary Email */}
            <div>
              <label style={labelStyle}>Primary Email *</label>
              <input 
                type="email" 
                value={contact.email} 
                onChange={e => setContact({ ...contact, email: e.target.value })} 
                placeholder="pi@university.edu" 
                style={inputStyle} 
              />
            </div>

            {/* Alternate Email */}
            <div>
              <label style={labelStyle}>Alternate Email (Optional)</label>
              <input 
                type="email" 
                value={contact.alternateEmail} 
                onChange={e => setContact({ ...contact, alternateEmail: e.target.value })} 
                placeholder="e.g. debabrata.maity@gmail.com" 
                style={inputStyle} 
              />
              <span style={helperStyle}>
                If provided, will appear on the website as <code>primary / alternate</code>. If blank, only the primary email will be shown.
              </span>
            </div>

            {/* Primary Phone */}
            <div>
              <label style={labelStyle}>Primary Phone *</label>
              <input 
                type="text" 
                value={contact.phone} 
                onChange={e => setContact({ ...contact, phone: e.target.value })} 
                placeholder="+91 33 XXXX XXXX" 
                style={inputStyle} 
              />
            </div>

            {/* Alternate Phone */}
            <div>
              <label style={labelStyle}>Alternate Phone (Optional)</label>
              <input 
                type="text" 
                value={contact.alternatePhone} 
                onChange={e => setContact({ ...contact, alternatePhone: e.target.value })} 
                placeholder="e.g. +91 98 XXXX XXXX" 
                style={inputStyle} 
              />
              <span style={helperStyle}>
                If provided, will appear on the website as <code>primary / alternate</code>. If blank, only the primary phone will be shown.
              </span>
            </div>

            {/* Address */}
            <div>
              <label style={labelStyle}>Lab Address / Location</label>
              <textarea 
                rows={3}
                value={contact.address} 
                onChange={e => setContact({ ...contact, address: e.target.value })} 
                placeholder="Room 301, Chemistry Building, Your University, Newtown Kolkata" 
                style={{ ...inputStyle, resize: 'vertical' }} 
              />
              <span style={helperStyle}>
                Shown under the Address icon on the Contact page and in the footer.
              </span>
            </div>

            <div style={{ paddingTop: '0.5rem' }}>
              <button 
                onClick={handleSaveContact} 
                disabled={isSavingContact}
                className="btn btn-primary" 
                style={{ alignSelf: 'flex-start' }}
              >
                {isSavingContact ? 'Saving...' : 'Save Contact Details'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
