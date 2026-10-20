require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const admin = require('firebase-admin')

let serviceAccount = null
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === 'string'
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
            : process.env.FIREBASE_SERVICE_ACCOUNT
    } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', e.message)
    }
}

if (!serviceAccount) {
    try {
        serviceAccount = require('./serviceAccountKey.json')
    } catch {
        console.warn('⚠️ No local serviceAccountKey.json found.')
    }
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
} else {
    try {
        admin.initializeApp()
    } catch (err) {
        console.error('Firebase init fallback error:', err.message)
    }
}

const db = admin.firestore()
const app = express()
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true, limit: '15mb' }))
app.use(cors())

// ── Auth middleware ──
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token' })
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'myLabSuperSecretKey2025')
        next()
    } catch {
        res.status(401).json({ error: 'Invalid token' })
    }
}

// ── Login ──
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body
    const adminUser = process.env.ADMIN_USERNAME || 'admin'
    const validUser = username === adminUser
    
    // Check against bcrypt hash or fallback to default lab2025 / lab2026
    const hashMatch = process.env.ADMIN_PASSWORD_HASH ? bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH) : false
    const validPass = hashMatch || password === 'lab2025' || password === 'lab2026'
    
    if (!validUser || !validPass) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'myLabSuperSecretKey2025', { expiresIn: '8h' })
    res.json({ token })
})

// ── Verify Token ──
app.get('/auth/verify', authMiddleware, (req, res) => {
    res.json({ valid: true, user: req.user })
})

// ── Publications ──
app.get('/api/publications', async (req, res) => {
    try {
        const snapshot = await db.collection('publications').get()
        const pubs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        pubs.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
        res.json(pubs)
    } catch (err) {
        console.error('Error getting publications:', err)
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/publications', authMiddleware, async (req, res) => {
    try {
        const pubData = { ...req.body }
        delete pubData.id
        const ref = await db.collection('publications').add(pubData)
        res.json({ id: ref.id, ...pubData })
    } catch (err) {
        console.error('Error adding publication:', err)
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/publications/:id', authMiddleware, async (req, res) => {
    try {
        const pubData = { ...req.body }
        delete pubData.id
        await db.collection('publications').doc(req.params.id).set(pubData, { merge: true })
        res.json({ id: req.params.id, ...pubData })
    } catch (err) {
        console.error('Error updating publication:', err)
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/publications/:id', authMiddleware, async (req, res) => {
    try {
        console.log(`🗑️ Deleting publication from Firestore: ${req.params.id}`)
        await db.collection('publications').doc(req.params.id).delete()
        console.log(`✅ Publication deleted from Firestore: ${req.params.id}`)
        res.json({ success: true, id: req.params.id })
    } catch (err) {
        console.error('Error deleting publication:', err)
        res.status(500).json({ error: err.message })
    }
})

// ── Members ──
app.get('/api/members', async (req, res) => {
    try {
        const snapshot = await db.collection('members').get()
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        res.json(members)
    } catch (err) {
        console.error('Error getting members:', err)
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/members', authMiddleware, async (req, res) => {
    try {
        const memberData = { ...req.body }
        delete memberData.id
        const ref = await db.collection('members').add(memberData)
        res.json({ id: ref.id, ...memberData })
    } catch (err) {
        console.error('Error adding member:', err)
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/members/:id', authMiddleware, async (req, res) => {
    try {
        const memberData = { ...req.body }
        delete memberData.id
        await db.collection('members').doc(req.params.id).set(memberData, { merge: true })
        res.json({ id: req.params.id, ...memberData })
    } catch (err) {
        console.error('Error updating member:', err)
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/members/:id', authMiddleware, async (req, res) => {
    try {
        console.log(`🗑️ Deleting member from Firestore: ${req.params.id}`)
        await db.collection('members').doc(req.params.id).delete()
        console.log(`✅ Member deleted from Firestore: ${req.params.id}`)
        res.json({ success: true, id: req.params.id })
    } catch (err) {
        console.error('Error deleting member:', err)
        res.status(500).json({ error: err.message })
    }
})

// ── News ──
app.get('/api/news', async (req, res) => {
    try {
        const snapshot = await db.collection('news').get()
        const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        res.json(news)
    } catch (err) {
        console.error('Error getting news:', err)
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/news', authMiddleware, async (req, res) => {
    try {
        const newsData = { ...req.body }
        delete newsData.id
        const ref = await db.collection('news').add(newsData)
        res.json({ id: ref.id, ...newsData })
    } catch (err) {
        console.error('Error adding news:', err)
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/news/:id', authMiddleware, async (req, res) => {
    try {
        const newsData = { ...req.body }
        delete newsData.id
        await db.collection('news').doc(req.params.id).set(newsData, { merge: true })
        res.json({ id: req.params.id, ...newsData })
    } catch (err) {
        console.error('Error updating news:', err)
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/news/:id', authMiddleware, async (req, res) => {
    try {
        console.log(`🗑️ Deleting news from Firestore: ${req.params.id}`)
        await db.collection('news').doc(req.params.id).delete()
        console.log(`✅ News deleted from Firestore: ${req.params.id}`)
        res.json({ success: true, id: req.params.id })
    } catch (err) {
        console.error('Error deleting news:', err)
        res.status(500).json({ error: err.message })
    }
})

// ── Facilities ──
app.get('/api/facilities', async (req, res) => {
    try {
        const snapshot = await db.collection('facilities').get()
        const facilities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        res.json(facilities)
    } catch (err) {
        console.error('Error getting facilities:', err)
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/facilities', authMiddleware, async (req, res) => {
    try {
        const data = { ...req.body }
        delete data.id
        const ref = await db.collection('facilities').add(data)
        res.json({ id: ref.id, ...data })
    } catch (err) {
        console.error('Error adding facility:', err)
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/facilities/:id', authMiddleware, async (req, res) => {
    try {
        const data = { ...req.body }
        delete data.id
        await db.collection('facilities').doc(req.params.id).set(data, { merge: true })
        res.json({ id: req.params.id, ...data })
    } catch (err) {
        console.error('Error updating facility:', err)
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/facilities/:id', authMiddleware, async (req, res) => {
    try {
        console.log(`🗑️ Deleting facility from Firestore: ${req.params.id}`)
        await db.collection('facilities').doc(req.params.id).delete()
        console.log(`✅ Facility deleted from Firestore: ${req.params.id}`)
        res.json({ success: true, id: req.params.id })
    } catch (err) {
        console.error('Error deleting facility:', err)
        res.status(500).json({ error: err.message })
    }
})

// ── Profile / PI Settings ──
app.get('/api/profile', async (req, res) => {
    try {
        const doc = await db.collection('settings').doc('profile').get()
        if (!doc.exists) {
            return res.json({})
        }
        res.json(doc.data())
    } catch (err) {
        console.error('Error getting profile:', err)
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/profile', authMiddleware, async (req, res) => {
    try {
        const profileData = { ...req.body }
        await db.collection('settings').doc('profile').set(profileData, { merge: true })
        console.log('✅ Profile updated in Firestore')
        res.json(profileData)
    } catch (err) {
        console.error('Error saving profile:', err)
        res.status(500).json({ error: err.message })
    }
})

// ── PI Research & Publications Settings ──
app.get('/api/pi-research-publications', async (req, res) => {
    try {
        const doc = await db.collection('settings').doc('pi_research_publications').get()
        if (!doc.exists) {
            return res.json({})
        }
        res.json(doc.data())
    } catch (err) {
        console.error('Error getting PI research & publications:', err)
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/pi-research-publications', authMiddleware, async (req, res) => {
    try {
        const data = { ...req.body }
        await db.collection('settings').doc('pi_research_publications').set(data, { merge: true })
        console.log('✅ PI research & publications updated in Firestore')
        res.json(data)
    } catch (err) {
        console.error('Error saving PI research & publications:', err)
        res.status(500).json({ error: err.message })
    }
})

// ── Contact Settings ──
app.get('/api/contact', async (req, res) => {
    try {
        const doc = await db.collection('settings').doc('contact').get()
        if (!doc.exists) {
            return res.json({})
        }
        res.json(doc.data())
    } catch (err) {
        console.error('Error getting contact info:', err)
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/contact', authMiddleware, async (req, res) => {
    try {
        const contactData = { ...req.body }
        await db.collection('settings').doc('contact').set(contactData, { merge: true })
        console.log('✅ Contact info updated in Firestore')
        res.json(contactData)
    } catch (err) {
        console.error('Error saving contact info:', err)
        res.status(500).json({ error: err.message })
    }
})

// ── Research ──
app.get('/api/research', async (req, res) => {
    try {
        const snapshot = await db.collection('research').get()
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        res.json(items)
    } catch (err) {
        console.error('Error getting research areas:', err)
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/research', authMiddleware, async (req, res) => {
    try {
        const data = { ...req.body }
        delete data.id
        const ref = await db.collection('research').add(data)
        res.json({ id: ref.id, ...data })
    } catch (err) {
        console.error('Error adding research area:', err)
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/research/:id', authMiddleware, async (req, res) => {
    try {
        const data = { ...req.body }
        delete data.id
        await db.collection('research').doc(req.params.id).set(data, { merge: true })
        res.json({ id: req.params.id, ...data })
    } catch (err) {
        console.error('Error updating research area:', err)
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/research/:id', authMiddleware, async (req, res) => {
    try {
        await db.collection('research').doc(req.params.id).delete()
        res.json({ success: true, id: req.params.id })
    } catch (err) {
        console.error('Error deleting research area:', err)
        res.status(500).json({ error: err.message })
    }
})

// ── About (Lab Info & PI Details) ──
app.get('/api/about', async (req, res) => {
    try {
        const doc = await db.collection('settings').doc('about').get()
        if (!doc.exists) {
            return res.json({})
        }
        res.json(doc.data())
    } catch (err) {
        console.error('Error getting about info:', err)
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/about', authMiddleware, async (req, res) => {
    try {
        const data = { ...req.body }
        await db.collection('settings').doc('about').set(data, { merge: true })
        console.log('✅ About info updated in Firestore')
        res.json(data)
    } catch (err) {
        console.error('Error saving about info:', err)
        res.status(500).json({ error: err.message })
    }
})

// ── Email Validation Helper ──
async function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return { valid: false, message: 'Email address is required.' }
    }
    const trimmed = email.trim()
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    if (!emailRegex.test(trimmed)) {
        return { valid: false, message: 'Please enter a valid email address (e.g. name@example.com).' }
    }
    const parts = trimmed.split('@')
    if (parts.length !== 2) return { valid: false, message: 'Invalid email address.' }
    const domain = parts[1].toLowerCase()
    const tld = domain.split('.').pop()
    if (!tld || tld.length < 2) {
        return { valid: false, message: 'The email domain extension is invalid.' }
    }

    // Verify domain existence via Google DNS-over-HTTPS (DoH)
    try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 3500)
        const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`, { signal: controller.signal })
        clearTimeout(timeout)
        if (res.ok) {
            const data = await res.json()
            if (data.Status === 3) {
                return { valid: false, message: `The email domain "@${domain}" does not exist. Please check for typos.` }
            }
            if (data.Status === 0) {
                if (!data.Answer || data.Answer.length === 0) {
                    const aRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`)
                    const aData = await aRes.json()
                    if (!aData.Answer || aData.Answer.length === 0) {
                        return { valid: false, message: `The domain "@${domain}" cannot receive emails (no mail server found).` }
                    }
                }
            }
        }
    } catch (err) {
        console.warn('DNS MX check skipped due to timeout/network:', err.message)
    }

    return { valid: true }
}

app.get('/api/validate-email', async (req, res) => {
    try {
        const result = await validateEmail(req.query.email)
        res.json(result)
    } catch (err) {
        res.status(500).json({ valid: false, message: err.message })
    }
})

// ── Contact Messages ──
app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, subject, message, recipients } = req.body

        // Validate sender email
        const emailValidation = await validateEmail(email)
        if (!emailValidation.valid) {
            return res.status(400).json({ error: emailValidation.message })
        }

        
        // Resolve target recipients:
        // Goes to both email IDs if alternate exists, or only 1st email ID if no alternate.
        let targetRecipients = []
        if (Array.isArray(recipients) && recipients.length > 0) {
            targetRecipients = recipients.map(r => String(r || '').trim()).filter(Boolean)
        } else {
            const contactDoc = await db.collection('settings').doc('contact').get()
            const contactData = contactDoc.exists ? contactDoc.data() : {}
            const pEmail = (contactData.email || '').trim()
            const aEmail = (contactData.alternateEmail || '').trim()
            if (pEmail) targetRecipients.push(pEmail)
            if (aEmail) targetRecipients.push(aEmail)
        }

        if (targetRecipients.length === 0) {
            targetRecipients = ['pi@university.edu']
        }

        const newMsg = {
            name: (name || '').trim(),
            email: (email || '').trim(),
            subject: (subject || '').trim() || 'General Inquiry',
            message: (message || '').trim(),
            recipients: targetRecipients,
            createdAt: new Date().toISOString()
        }

        // Save message to Firestore
        const ref = await db.collection('messages').add(newMsg)
        console.log(`📩 Contact message saved with ID: ${ref.id} for: ${targetRecipients.join(', ')}`)

        // Optional automated SMTP sending if configured in .env
        let emailSent = false
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: Number(process.env.SMTP_PORT) || 465,
                    secure: process.env.SMTP_SECURE === 'false' ? false : true,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                })

                await transporter.sendMail({
                    from: `"${newMsg.name}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
                    replyTo: newMsg.email,
                    to: targetRecipients.join(', '),
                    subject: newMsg.subject ? `[Lab Contact] ${newMsg.subject}` : `[Lab Contact] Message from ${newMsg.name}`,
                    text: `From: ${newMsg.name} (${newMsg.email})\nRecipients: ${targetRecipients.join(', ')}\n\nMessage:\n${newMsg.message}`,
                    html: `
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px; color: #1e293b;">
                            <div style="border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px;">
                                <h2 style="margin: 0; color: #0d1b2a; font-size: 1.3rem;">New Message from Lab Website</h2>
                            </div>
                            <p style="margin: 6px 0;"><strong>Sender Name:</strong> ${newMsg.name}</p>
                            <p style="margin: 6px 0;"><strong>Sender Email:</strong> <a href="mailto:${newMsg.email}" style="color: #2563eb;">${newMsg.email}</a></p>
                            <p style="margin: 6px 0;"><strong>Subject:</strong> ${newMsg.subject}</p>
                            <p style="margin: 6px 0;"><strong>Delivered to:</strong> ${targetRecipients.join(', ')}</p>
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
                            <p style="font-weight: 600; margin-bottom: 6px;">Message Content:</p>
                            <div style="background: #f8fafc; padding: 16px; border-radius: 6px; white-space: pre-wrap; font-size: 0.95rem; border: 1px solid #e2e8f0;">${newMsg.message}</div>
                        </div>
                    `
                })
                emailSent = true
                console.log(`✅ Mail delivered via SMTP to: ${targetRecipients.join(', ')}`)
            } catch (smtpErr) {
                console.warn('⚠️ SMTP send error (saved to Firestore):', smtpErr.message)
            }
        }

        res.json({
            success: true,
            id: ref.id,
            emailSent,
            recipients: targetRecipients
        })
    } catch (err) {
        console.error('Error handling contact message:', err)
        res.status(500).json({ error: err.message })
    }
})

app.get('/api/messages', authMiddleware, async (req, res) => {
    try {
        const snapshot = await db.collection('messages').get()
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        messages.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        res.json(messages)
    } catch (err) {
        console.error('Error retrieving messages:', err)
        res.status(500).json({ error: err.message })
    }
})

app.put('/api/messages/:id/read', authMiddleware, async (req, res) => {
    try {
        const { read } = req.body
        const isRead = typeof read === 'boolean' ? read : true
        await db.collection('messages').doc(req.params.id).set({ read: isRead }, { merge: true })
        res.json({ success: true, id: req.params.id, read: isRead })
    } catch (err) {
        console.error('Error updating message read status:', err)
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/messages/:id', authMiddleware, async (req, res) => {
    try {
        await db.collection('messages').doc(req.params.id).delete()
        res.json({ success: true, id: req.params.id })
    } catch (err) {
        console.error('Error deleting message:', err)
        res.status(500).json({ error: err.message })
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`))