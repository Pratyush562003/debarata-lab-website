import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LabDataProvider } from './context/LabDataContext'
import { ConfirmModalProvider } from './context/ConfirmModalContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Public pages
import Home from './pages/Home'
import About from './pages/About'
import Research from './pages/Research'
import Publications from './pages/Publications'
import Members from './pages/Members'
import Contact from './pages/Contact'

// Admin
import AdminLogin from './admin/AdminLogin'
import Dashboard, { DashboardOverview } from './admin/Dashboard'
import AboutManager from './admin/AboutManager'
import MyResearchPublicationsManager from './admin/MyResearchPublicationsManager'
import ResearchManager from './admin/ResearchManager'
import PublicationsManager from './admin/PublicationsManager'
import MembersManager from './admin/MembersManager'
import NewsManager from './admin/NewsManager'
import SettingsManager from './admin/SettingsManager'
import MessagesManager from './admin/MessagesManager'

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LabDataProvider>
    <AuthProvider>
    <ConfirmModalProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/research" element={<PublicLayout><Research /></PublicLayout>} />
        <Route path="/publications" element={<PublicLayout><Publications /></PublicLayout>} />
        <Route path="/members" element={<PublicLayout><Members /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        }>
          <Route index element={<DashboardOverview />} />
          <Route path="about" element={<AboutManager />} />
          <Route path="my-research-publications" element={<MyResearchPublicationsManager />} />
          <Route path="research" element={<ResearchManager />} />
          <Route path="facilities" element={<Navigate to="/admin/dashboard/research?tab=facilities" replace />} />
          <Route path="publications" element={<PublicationsManager />} />
          <Route path="members" element={<MembersManager />} />
          <Route path="news" element={<NewsManager />} />
          <Route path="messages" element={<MessagesManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<PublicLayout><div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '70px' }}><div style={{ textAlign: 'center' }}><h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'var(--navy)' }}>404</h1><p>Page not found.</p><a href="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>← Home</a></div></div></PublicLayout>} />
      </Routes>
    </ConfirmModalProvider>
    </AuthProvider>
    </LabDataProvider>
  )
}
