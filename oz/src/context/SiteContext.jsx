import React, { createContext, useContext, useState, useEffect } from 'react'
import { fetchSiteSettings } from '../services/api'

const SiteContext = createContext()

export const SiteProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await fetchSiteSettings()
        setSiteSettings(data.data)
      } catch (error) {
        console.error('Failed to load site settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  return (
    <SiteContext.Provider value={{ siteSettings, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSiteSettings = () => useContext(SiteContext)
