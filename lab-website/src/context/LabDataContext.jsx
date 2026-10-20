import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { 
  labInfo as defaultLabInfo, 
  piInfo as defaultPiInfo, 
  research as defaultResearch, 
  publications as defaultPublications, 
  members as defaultMembers,
  news as defaultNews,
  facilities as defaultFacilities
} from '../data/labData'
import { defaultPiResearchData } from '../data/piResearchData'
import { api } from '../api'

const LabDataContext = createContext(null)

function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

export function LabDataProvider({ children }) {
  const [labInfo, setLabInfoState]                     = useState(() => loadFromStorage('lab_labInfo',           defaultLabInfo))
  const [piInfo, setPiInfoState]                       = useState(() => loadFromStorage('lab_piInfo',            defaultPiInfo))
  const [research, setResearchState]                   = useState(() => loadFromStorage('lab_research',          defaultResearch))
  const [publications, setPublicationsState]           = useState(() => loadFromStorage('lab_publications',      defaultPublications))
  const [members, setMembersState]                     = useState(() => loadFromStorage('lab_members',           defaultMembers))
  const [news, setNewsState]                           = useState(() => loadFromStorage('lab_news',              defaultNews))
  const [facilities, setFacilitiesState]               = useState(() => loadFromStorage('lab_facilities',        defaultFacilities))
  const [piResearchPubs, setPiResearchPubsState]       = useState(() => loadFromStorage('lab_pi_research_pubs',  defaultPiResearchData))

  const setPiResearchPubs = setPiResearchPubsState

  const [dbConnected, setDbConnected] = useState(false)
  const [isSyncing, setIsSyncing]     = useState(false)
  const [isLoaded, setIsLoaded]       = useState(false)

  // Fetch live publications, members, news, facilities, and PI data from Firebase via API
  const refreshData = useCallback(async () => {
    try {
      const [pubs, mems, newsList, facs, profile, contact, resList, aboutData, piResPubs] = await Promise.all([
        api.getPublications().catch(err => { console.warn('Could not fetch publications:', err); return null }),
        api.getMembers().catch(err => { console.warn('Could not fetch members:', err); return null }),
        api.getNews().catch(err => { console.warn('Could not fetch news:', err); return null }),
        api.getFacilities().catch(err => { console.warn('Could not fetch facilities:', err); return null }),
        api.getProfile().catch(err => { console.warn('Could not fetch profile:', err); return null }),
        api.getContact().catch(err => { console.warn('Could not fetch contact:', err); return null }),
        api.getResearch().catch(err => { console.warn('Could not fetch research:', err); return null }),
        api.getAbout().catch(err => { console.warn('Could not fetch about:', err); return null }),
        api.getPiResearchPublications().catch(err => { console.warn('Could not fetch PI research & pubs:', err); return null })
      ])


      let connected = false

      if (Array.isArray(pubs)) {
        connected = true
        if (pubs.length > 0) {
          setPublicationsState(pubs)
          localStorage.setItem('lab_publications', JSON.stringify(pubs))
        }
      }

      if (Array.isArray(mems)) {
        connected = true
        if (mems.length > 0) {
          setMembersState(mems)
          localStorage.setItem('lab_members', JSON.stringify(mems))
        }
      }

      if (Array.isArray(newsList)) {
        connected = true
        if (newsList.length > 0) {
          setNewsState(newsList)
          localStorage.setItem('lab_news', JSON.stringify(newsList))
        }
      }

      if (Array.isArray(facs)) {
        connected = true
        if (facs.length > 0) {
          setFacilitiesState(facs)
          localStorage.setItem('lab_facilities', JSON.stringify(facs))
        }
      }

      if (Array.isArray(resList)) {
        connected = true
        if (resList.length > 0) {
          setResearchState(resList)
          localStorage.setItem('lab_research', JSON.stringify(resList))
        }
      }

      if (profile && typeof profile === 'object' && Object.keys(profile).length > 0) {
        connected = true
        setPiInfoState(prev => {
          const next = { ...prev, ...profile }
          localStorage.setItem('lab_piInfo', JSON.stringify(next))
          return next
        })
      }

      if (aboutData && typeof aboutData === 'object' && Object.keys(aboutData).length > 0) {
        connected = true
        // Strip contact fields so aboutData never overrides contact settings
        const { email, alternateEmail, phone, alternatePhone, address, ...cleanAbout } = aboutData
        setLabInfoState(prev => {
          const next = { ...prev, ...cleanAbout }
          localStorage.setItem('lab_labInfo', JSON.stringify(next))
          return next
        })
      }

      if (contact && typeof contact === 'object' && Object.keys(contact).length > 0) {
        connected = true
        setLabInfoState(prev => {
          const next = { 
            ...prev, 
            email: contact.email || '',
            alternateEmail: contact.alternateEmail || '',
            phone: contact.phone || '',
            alternatePhone: contact.alternatePhone || '',
            address: contact.address || ''
          }
          localStorage.setItem('lab_labInfo', JSON.stringify(next))
          return next
        })
      }

      if (piResPubs && typeof piResPubs === 'object' && Object.keys(piResPubs).length > 0) {
        connected = true
        setPiResearchPubsState(prev => {
          const next = { ...prev, ...piResPubs }
          localStorage.setItem('lab_pi_research_pubs', JSON.stringify(next))
          return next
        })
      }

      setDbConnected(connected)
    } catch (err) {
      console.warn('Backend server offline or unreachable:', err)
      setDbConnected(false)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  // Dynamically sync favicon and document title to the browser tab
  useEffect(() => {
    const faviconUrl = labInfo?.favicon || '/fav.png'
    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.type = 'image/png'
    link.href = faviconUrl

    let appleLink = document.querySelector("link[rel='apple-touch-icon']")
    if (!appleLink) {
      appleLink = document.createElement('link')
      appleLink.rel = 'apple-touch-icon'
      document.head.appendChild(appleLink)
    }
    appleLink.href = faviconUrl
  }, [labInfo?.favicon])

  useEffect(() => {
    if (labInfo?.name) {
      document.title = `${labInfo.name} | ${labInfo.university || 'Amity University'}`
    }
  }, [labInfo?.name, labInfo?.university])

  // Publications CRUD
  const addPublication = async (pubData) => {
    try {
      const saved = await api.addPublication(pubData)
      if (saved && saved.id) {
        setPublicationsState(prev => {
          const next = [saved, ...prev.filter(p => p.id !== saved.id)]
          localStorage.setItem('lab_publications', JSON.stringify(next))
          return next
        })
        return saved
      }
    } catch (err) {
      console.error('Failed to add publication to Firebase:', err)
    }
    const fallbackItem = { ...pubData, id: String(Date.now()) }
    setPublicationsState(prev => {
      const next = [fallbackItem, ...prev]
      localStorage.setItem('lab_publications', JSON.stringify(next))
      return next
    })
    return fallbackItem
  }

  const updatePublication = async (id, pubData) => {
    try {
      const updated = await api.updatePublication(id, pubData)
      if (updated) {
        setPublicationsState(prev => {
          const next = prev.map(p => p.id === id ? { ...updated, id } : p)
          localStorage.setItem('lab_publications', JSON.stringify(next))
          return next
        })
        return updated
      }
    } catch (err) {
      console.error('Failed to update publication in Firebase:', err)
    }
    setPublicationsState(prev => {
      const next = prev.map(p => p.id === id ? { ...pubData, id } : p)
      localStorage.setItem('lab_publications', JSON.stringify(next))
      return next
    })
  }

  const deletePublication = async (id) => {
    try {
      await api.deletePublication(id)
    } catch (err) {
      console.error('Failed to delete publication from Firebase:', err)
      if (err.message && (err.message.includes('token') || err.message.includes('401'))) {
        alert('Could not delete from Firebase: Please log in again.')
        return
      }
    }
    setPublicationsState(prev => {
      const next = prev.filter(p => p.id !== id)
      localStorage.setItem('lab_publications', JSON.stringify(next))
      return next
    })
  }

  // Members CRUD
  const addMember = async (memberData) => {
    try {
      const saved = await api.addMember(memberData)
      if (saved && saved.id) {
        setMembersState(prev => {
          const next = [...prev.filter(m => m.id !== saved.id), saved]
          localStorage.setItem('lab_members', JSON.stringify(next))
          return next
        })
        return saved
      }
    } catch (err) {
      console.error('Failed to add member to Firebase:', err)
    }
    const fallbackItem = { ...memberData, id: String(Date.now()) }
    setMembersState(prev => {
      const next = [...prev, fallbackItem]
      localStorage.setItem('lab_members', JSON.stringify(next))
      return next
    })
    return fallbackItem
  }

  const updateMember = async (id, memberData) => {
    try {
      const updated = await api.updateMember(id, memberData)
      if (updated) {
        setMembersState(prev => {
          const next = prev.map(m => m.id === id ? { ...updated, id } : m)
          localStorage.setItem('lab_members', JSON.stringify(next))
          return next
        })
        return updated
      }
    } catch (err) {
      console.error('Failed to update member in Firebase:', err)
    }
    setMembersState(prev => {
      const next = prev.map(m => m.id === id ? { ...memberData, id } : m)
      localStorage.setItem('lab_members', JSON.stringify(next))
      return next
    })
  }

  const deleteMember = async (id) => {
    try {
      await api.deleteMember(id)
    } catch (err) {
      console.error('Failed to delete member from Firebase:', err)
      if (err.message && (err.message.includes('token') || err.message.includes('401'))) {
        alert('Could not delete from Firebase: Please log in again.')
        return
      }
    }
    setMembersState(prev => {
      const next = prev.filter(m => m.id !== id)
      localStorage.setItem('lab_members', JSON.stringify(next))
      return next
    })
  }

  // News CRUD
  const addNews = async (newsData) => {
    try {
      const saved = await api.addNews(newsData)
      if (saved && saved.id) {
        setNewsState(prev => {
          const next = [saved, ...prev.filter(n => n.id !== saved.id)]
          localStorage.setItem('lab_news', JSON.stringify(next))
          return next
        })
        return saved
      }
    } catch (err) {
      console.error('Failed to add news to Firebase:', err)
    }
    const fallbackItem = { ...newsData, id: String(Date.now()) }
    setNewsState(prev => {
      const next = [fallbackItem, ...prev]
      localStorage.setItem('lab_news', JSON.stringify(next))
      return next
    })
    return fallbackItem
  }

  const updateNews = async (id, newsData) => {
    try {
      const updated = await api.updateNews(id, newsData)
      if (updated) {
        setNewsState(prev => {
          const next = prev.map(n => n.id === id ? { ...updated, id } : n)
          localStorage.setItem('lab_news', JSON.stringify(next))
          return next
        })
        return updated
      }
    } catch (err) {
      console.error('Failed to update news in Firebase:', err)
    }
    setNewsState(prev => {
      const next = prev.map(n => n.id === id ? { ...newsData, id } : n)
      localStorage.setItem('lab_news', JSON.stringify(next))
      return next
    })
  }

  const deleteNews = async (id) => {
    try {
      await api.deleteNews(id)
    } catch (err) {
      console.error('Failed to delete news from Firebase:', err)
      if (err.message && (err.message.includes('token') || err.message.includes('401'))) {
        alert('Could not delete from Firebase: Please log in again.')
        return
      }
    }
    setNewsState(prev => {
      const next = prev.filter(n => n.id !== id)
      localStorage.setItem('lab_news', JSON.stringify(next))
      return next
    })
  }

  // Facilities CRUD
  const addFacility = async (facilityData) => {
    try {
      const saved = await api.addFacility(facilityData)
      if (saved && saved.id) {
        setFacilitiesState(prev => {
          const next = [...prev.filter(f => f.id !== saved.id), saved]
          localStorage.setItem('lab_facilities', JSON.stringify(next))
          return next
        })
        return saved
      }
    } catch (err) {
      console.error('Failed to add facility to Firebase:', err)
    }
    const fallbackItem = { ...facilityData, id: String(Date.now()) }
    setFacilitiesState(prev => {
      const next = [...prev, fallbackItem]
      localStorage.setItem('lab_facilities', JSON.stringify(next))
      return next
    })
    return fallbackItem
  }

  const updateFacility = async (id, facilityData) => {
    try {
      const updated = await api.updateFacility(id, facilityData)
      if (updated) {
        setFacilitiesState(prev => {
          const next = prev.map(f => f.id === id ? { ...updated, id } : f)
          localStorage.setItem('lab_facilities', JSON.stringify(next))
          return next
        })
        return updated
      }
    } catch (err) {
      console.error('Failed to update facility in Firebase:', err)
    }
    setFacilitiesState(prev => {
      const next = prev.map(f => f.id === id ? { ...facilityData, id } : f)
      localStorage.setItem('lab_facilities', JSON.stringify(next))
      return next
    })
  }

  const deleteFacility = async (id) => {
    try {
      await api.deleteFacility(id)
    } catch (err) {
      console.error('Failed to delete facility from Firebase:', err)
      if (err.message && (err.message.includes('token') || err.message.includes('401'))) {
        alert('Could not delete from Firebase: Please log in again.')
        return
      }
    }
    setFacilitiesState(prev => {
      const next = prev.filter(f => f.id !== id)
      localStorage.setItem('lab_facilities', JSON.stringify(next))
      return next
    })
  }

  // Upload initial default data into Firebase Firestore
  const syncDefaultDataToFirebase = async () => {
    setIsSyncing(true)
    try {
      for (const pub of defaultPublications) {
        const { id, ...rest } = pub
        await api.addPublication(rest)
      }
      for (const mem of defaultMembers) {
        const { id, ...rest } = mem
        await api.addMember(rest)
      }
      for (const n of defaultNews) {
        const { id, ...rest } = n
        await api.addNews(rest)
      }
      for (const f of defaultFacilities) {
        const { id, ...rest } = f
        await api.addFacility(rest)
      }
      await refreshData()
      return true
    } catch (err) {
      console.error('Failed to sync default data to Firebase:', err)
      return false
    } finally {
      setIsSyncing(false)
    }
  }

  const setLabInfo = (updater) => {
    setLabInfoState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem('lab_labInfo', JSON.stringify(next))
      return next
    })
  }

  const setPiInfo = (updater) => {
    setPiInfoState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem('lab_piInfo', JSON.stringify(next))
      return next
    })
  }

  const setResearch = (updater) => {
    setResearchState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem('lab_research', JSON.stringify(next))
      return next
    })
  }

  const setPublications = (updater) => {
    setPublicationsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem('lab_publications', JSON.stringify(next))
      return next
    })
  }

  const setMembers = (updater) => {
    setMembersState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem('lab_members', JSON.stringify(next))
      return next
    })
  }

  const setNews = (updater) => {
    setNewsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem('lab_news', JSON.stringify(next))
      return next
    })
  }

  const setFacilities = (updater) => {
    setFacilitiesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem('lab_facilities', JSON.stringify(next))
      return next
    })
  }

  const updateProfile = async (profileData) => {
    try {
      const saved = await api.updateProfile(profileData)
      if (saved) {
        setPiInfoState(prev => {
          const next = { ...prev, ...saved }
          localStorage.setItem('lab_piInfo', JSON.stringify(next))
          return next
        })
        return saved
      }
    } catch (err) {
      console.error('Failed to update profile in Firebase:', err)
      setPiInfoState(prev => {
        const next = { ...prev, ...profileData }
        localStorage.setItem('lab_piInfo', JSON.stringify(next))
        return next
      })
      throw err
    }
  }

  const updateContact = async (contactData) => {
    try {
      const saved = await api.updateContact(contactData)
      if (saved) {
        setLabInfoState(prev => {
          const next = { ...prev, ...saved }
          localStorage.setItem('lab_labInfo', JSON.stringify(next))
          return next
        })
        return saved
      }
    } catch (err) {
      console.error('Failed to update contact in Firebase:', err)
      setLabInfoState(prev => {
        const next = { ...prev, ...contactData }
        localStorage.setItem('lab_labInfo', JSON.stringify(next))
        return next
      })
      throw err
    }
  }

  // Research CRUD
  const addResearch = async (data) => {
    try {
      const saved = await api.addResearch(data)
      if (saved && saved.id) {
        setResearchState(prev => {
          const next = [...prev.filter(r => r.id !== saved.id), saved]
          localStorage.setItem('lab_research', JSON.stringify(next))
          return next
        })
        return saved
      }
    } catch (err) {
      console.error('Failed to add research area to Firebase:', err)
    }
    const fallbackItem = { ...data, id: String(Date.now()) }
    setResearchState(prev => {
      const next = [...prev, fallbackItem]
      localStorage.setItem('lab_research', JSON.stringify(next))
      return next
    })
    return fallbackItem
  }

  const updateResearch = async (id, data) => {
    try {
      const updated = await api.updateResearch(id, data)
      if (updated) {
        setResearchState(prev => {
          const next = prev.map(r => r.id === id ? { ...updated, id } : r)
          localStorage.setItem('lab_research', JSON.stringify(next))
          return next
        })
        return updated
      }
    } catch (err) {
      console.error('Failed to update research area in Firebase:', err)
    }
    setResearchState(prev => {
      const next = prev.map(r => r.id === id ? { ...data, id } : r)
      localStorage.setItem('lab_research', JSON.stringify(next))
      return next
    })
  }

  const deleteResearch = async (id) => {
    try {
      await api.deleteResearch(id)
    } catch (err) {
      console.error('Failed to delete research area from Firebase:', err)
      if (err.message && (err.message.includes('token') || err.message.includes('401'))) {
        alert('Could not delete from Firebase: Please log in again.')
        return
      }
    }
    setResearchState(prev => {
      const next = prev.filter(r => r.id !== id)
      localStorage.setItem('lab_research', JSON.stringify(next))
      return next
    })
  }

  // About update
  const updateAbout = async (aboutData) => {
    try {
      const { email, alternateEmail, phone, alternatePhone, address, ...cleanAbout } = aboutData || {}
      const saved = await api.updateAbout(cleanAbout)
      if (saved) {
        setLabInfoState(prev => {
          const next = { ...prev, ...cleanAbout }
          localStorage.setItem('lab_labInfo', JSON.stringify(next))
          return next
        })
        return saved
      }
    } catch (err) {
      console.error('Failed to update about info in Firebase:', err)
      const { email, alternateEmail, phone, alternatePhone, address, ...cleanAbout } = aboutData || {}
      setLabInfoState(prev => {
        const next = { ...prev, ...cleanAbout }
        localStorage.setItem('lab_labInfo', JSON.stringify(next))
        return next
      })
      throw err
    }
  }

  // PI Research & Publications update
  const updatePiResearchPublications = async (data) => {
    try {
      const saved = await api.updatePiResearchPublications(data)
      if (saved) {
        setPiResearchPubsState(prev => {
          const next = { ...prev, ...saved }
          localStorage.setItem('lab_pi_research_pubs', JSON.stringify(next))
          return next
        })
        return saved
      }
    } catch (err) {
      console.error('Failed to update PI research & publications in Firebase:', err)
      setPiResearchPubsState(prev => {
        const next = { ...prev, ...data }
        localStorage.setItem('lab_pi_research_pubs', JSON.stringify(next))
        return next
      })
      throw err
    }
  }

  return (
    <LabDataContext.Provider value={{ 
      labInfo, setLabInfo, 
      piInfo, setPiInfo, 
      research, setResearch, 
      publications, setPublications, 
      members, setMembers, 
      news, setNews, 
      facilities, setFacilities,
      piResearchPubs, setPiResearchPubs,
      updatePiResearchPublications,
      addPublication, updatePublication, deletePublication,
      addMember, updateMember, deleteMember,
      addNews, updateNews, deleteNews,
      addFacility, updateFacility, deleteFacility,
      addResearch, updateResearch, deleteResearch,
      updateProfile,
      updateContact,
      updateAbout,
      dbConnected, isSyncing, isLoaded, refreshData, syncDefaultDataToFirebase
    }}>
      {children}
    </LabDataContext.Provider>
  )
}


export const useLabData = () => useContext(LabDataContext)
