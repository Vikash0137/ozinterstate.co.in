import { Link } from 'react-router-dom'
import ozLogo from '../assets/oz_logo.png'
import { COMPANY } from '../data/siteData'

export default function Logo({ className = '', light = false }) {
  return (
    <Link
      to="/"
      className={`flex items-center ${className}`}
      aria-label={`${COMPANY.name} home`}
    >
      <img
        src={ozLogo}
        alt={COMPANY.name}
        className={`h-20 w-auto object-contain transition-transform duration-300 hover:scale-105 sm:h-24 ${light ? 'brightness-0 invert' : ''}`}
      />
    </Link>
  )
}