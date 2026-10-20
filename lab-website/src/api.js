const BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : 'http://localhost:5000')
const getToken = () => localStorage.getItem('lab_token')

const checkResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('lab_token')
    localStorage.removeItem('lab_admin_user')
    sessionStorage.clear()
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      window.location.replace('/admin/login')
    }
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`)
  }
  return data
}

export const api = {
  verifyToken: () => fetch(`${BASE}/auth/verify`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(checkResponse),
  getPublications: () => fetch(`${BASE}/api/publications`).then(checkResponse),
  addPublication: (data) => fetch(`${BASE}/api/publications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),
  updatePublication: (id, data) => fetch(`${BASE}/api/publications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),
  deletePublication: (id) => fetch(`${BASE}/api/publications/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(checkResponse),

  getMembers: () => fetch(`${BASE}/api/members`).then(checkResponse),
  addMember: (data) => fetch(`${BASE}/api/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),
  updateMember: (id, data) => fetch(`${BASE}/api/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),
  deleteMember: (id) => fetch(`${BASE}/api/members/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(checkResponse),

  getNews: () => fetch(`${BASE}/api/news`).then(checkResponse),
  addNews: (data) => fetch(`${BASE}/api/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),
  updateNews: (id, data) => fetch(`${BASE}/api/news/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),
  deleteNews: (id) => fetch(`${BASE}/api/news/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(checkResponse),

  getFacilities: () => fetch(`${BASE}/api/facilities`).then(checkResponse),
  addFacility: (data) => fetch(`${BASE}/api/facilities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),
  updateFacility: (id, data) => fetch(`${BASE}/api/facilities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),
  deleteFacility: (id) => fetch(`${BASE}/api/facilities/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(checkResponse),

  getProfile: () => fetch(`${BASE}/api/profile`).then(checkResponse),
  updateProfile: (data) => fetch(`${BASE}/api/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),

  getContact: () => fetch(`${BASE}/api/contact`).then(checkResponse),
  updateContact: (data) => fetch(`${BASE}/api/contact`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),

  getResearch: () => fetch(`${BASE}/api/research`).then(checkResponse),
  addResearch: (data) => fetch(`${BASE}/api/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),
  updateResearch: (id, data) => fetch(`${BASE}/api/research/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),
  deleteResearch: (id) => fetch(`${BASE}/api/research/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(checkResponse),

  getAbout: () => fetch(`${BASE}/api/about`).then(checkResponse),
  updateAbout: (data) => fetch(`${BASE}/api/about`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),

  getPiResearchPublications: () => fetch(`${BASE}/api/pi-research-publications`).then(checkResponse),
  updatePiResearchPublications: (data) => fetch(`${BASE}/api/pi-research-publications`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  }).then(checkResponse),

  validateEmail: (email) => fetch(`${BASE}/api/validate-email?email=${encodeURIComponent(email)}`).then(checkResponse),


  sendMessage: (data) => fetch(`${BASE}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(checkResponse),


  getMessages: () => fetch(`${BASE}/api/messages`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(checkResponse),

  markMessageRead: (id, read = true) => fetch(`${BASE}/api/messages/${id}/read`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ read })
  }).then(checkResponse),

  deleteMessage: (id) => fetch(`${BASE}/api/messages/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  }).then(checkResponse),
}

