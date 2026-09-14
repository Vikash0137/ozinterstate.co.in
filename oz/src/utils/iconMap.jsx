import {
  Home,
  Building2,
  Truck,
  Sofa,
  PackageOpen,
  Warehouse,
  ShieldCheck,
  Users,
  BadgeDollarSign,
  Route,
  Clock,
  HeartHandshake,
  CheckCircle,
  MapPin,
  CalendarDays,
  Phone,
  Mail,
  FileText,
  Star,
  BriefcaseBusiness,
  Sparkles,
} from 'lucide-react'
import React from 'react'

const icons = {
  Home,
  Building2,
  Truck,
  Sofa,
  PackageOpen,
  Warehouse,
  ShieldCheck,
  Users,
  BadgeDollarSign,
  Route,
  Clock,
  HeartHandshake,
  CheckCircle,
  MapPin,
  CalendarDays,
  Phone,
  Mail,
  FileText,
  Star,
  BriefcaseBusiness,
  Sparkles,
}

const aliasMap = {
  'interstate specialists': 'Route',
  'careful handling': 'ShieldCheck',
  'flexible solutions': 'Sparkles',
  'homes & businesses': 'Building2',
  'professional service': 'CheckCircle',
  'reliable service': 'ShieldCheck',
  'trusted service': 'Star',
  'experienced team': 'Users',
  'transparent pricing': 'BadgeDollarSign',
  'timely delivery': 'Clock',
  'customer care': 'HeartHandshake',
  'packing and moving': 'PackageOpen',
  'storage solutions': 'Warehouse',
  'route planning': 'Route',
}

export const getIcon = (iconName, props = {}) => {
  const key = typeof iconName === 'string' ? iconName.trim() : ''
  const normalized = key.toLowerCase()
  const resolvedName = aliasMap[normalized] || key
  const IconComponent = icons[resolvedName] || icons[resolvedName.replace(/\s+/g, '')]

  if (!IconComponent) {
    return <ShieldCheck {...props} />
  }

  return <IconComponent {...props} />
}
