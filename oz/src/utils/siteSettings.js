import { COMPANY } from '../data/siteData.js'

export const DEFAULT_SITE_SETTINGS = {
  siteName: COMPANY.name,
  fullName: COMPANY.fullName,
  tagline: COMPANY.tagline,
  phone: COMPANY.phone,
  phoneHref: COMPANY.phoneHref,
  emergencyPhone: COMPANY.emergency,
  emergencyPhoneHref: COMPANY.emergencyHref,
  email: COMPANY.email,
  emailHref: COMPANY.emailHref,
  address: COMPANY.address,
  openingHours: 'Mon–Sat: 7am – 7pm AEST',
  mapUrl: '',
  social: {
    facebook: '#',
    instagram: '#',
    linkedin: '#',
    twitter: '#',
    youtube: '#',
    whatsapp: '#',
  },
}

export const resolveContactValue = (settings, field, fallback = '') => {
  const value = settings?.[field]
  return value && String(value).trim() ? String(value).trim() : fallback
}

export const resolveSocialUrl = (settings, platform, fallback = '#') => {
  const value = settings?.social?.[platform]
  return value && String(value).trim() ? String(value).trim() : fallback
}

export const resolveCompanyDetails = (settings) => ({
  ...DEFAULT_SITE_SETTINGS,
  ...(settings || {}),
  phone: resolveContactValue(settings, 'phone', DEFAULT_SITE_SETTINGS.phone),
  phoneHref: resolveContactValue(settings, 'phoneHref', DEFAULT_SITE_SETTINGS.phoneHref),
  email: resolveContactValue(settings, 'email', DEFAULT_SITE_SETTINGS.email),
  emailHref: resolveContactValue(settings, 'emailHref', DEFAULT_SITE_SETTINGS.emailHref),
  address: resolveContactValue(settings, 'address', DEFAULT_SITE_SETTINGS.address),
  social: {
    ...DEFAULT_SITE_SETTINGS.social,
    ...(settings?.social || {}),
  },
})

export const resolveApiBaseUrl = () => {
  const viteApiUrl = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_API_URL : undefined
  return viteApiUrl || '/ozinterstate/api'
}
