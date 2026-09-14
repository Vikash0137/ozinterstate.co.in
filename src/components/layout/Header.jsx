import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './Header.css'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/quotes': 'Quote Management',
  '/bookings': 'Booking Management',
  '/contacts': 'Contact Messages',
  '/services': 'Service Management',
  '/service-categories': 'Service Categories',
  '/pricing': 'Pricing Rules',
  '/team': 'Team Management',
  '/testimonials': 'Testimonials',
  '/blog': 'Blog Management',
  '/gallery': 'Gallery Management',
  '/analytics': 'Analytics',
  '/users': 'Users & Roles',
  '/settings': 'Settings',
}

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const profileRef = useRef(null)
  const notificationRef = useRef(null)

  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const storedUser = localStorage.getItem('ozAdminUser')

  let user = {
    name: 'OZ Admin',
    email: 'admin@ozinterstate.com',
    role: 'Super Admin',
  }

  try {
    if (storedUser) {
      user = JSON.parse(storedUser)
    }
  } catch (error) {
    console.error('Unable to parse stored admin user:', error)
  }

  const getCurrentPageTitle = () => {
    const pathname = location.pathname

    if (pathname === '/dashboard') {
      return 'Dashboard'
    }

    if (pathname === '/quotes') {
      return 'Quote Management'
    }

    if (pathname === '/quotes/new') {
      return 'New Quotes'
    }

    if (pathname === '/quotes/pending') {
      return 'Pending Quotes'
    }

    if (pathname === '/quotes/converted') {
      return 'Converted Quotes'
    }

    if (pathname.startsWith('/quotes/')) {
      return 'Quote Details'
    }

    if (pathname === '/bookings') {
      return 'Booking Management'
    }

    if (pathname.startsWith('/bookings/')) {
      return 'Booking Details'
    }

    if (pathname.startsWith('/contacts')) {
      return 'Contact Messages'
    }

    if (pathname === '/services') {
      return 'Service Management'
    }

    if (pathname === '/services/create') {
      return 'Add Service'
    }

    if (pathname.startsWith('/services/')) {
      return 'Service Details'
    }

    if (pathname.startsWith('/service-categories')) {
      return 'Service Categories'
    }

    if (pathname.startsWith('/pricing')) {
      return 'Pricing Rules'
    }

    if (pathname.startsWith('/team')) {
      return 'Team Management'
    }

    if (pathname.startsWith('/testimonials')) {
      return 'Testimonials'
    }

    if (pathname === '/blog') {
      return 'Blog Management'
    }

    if (pathname === '/blog/create') {
      return 'Add Blog Post'
    }

    if (pathname.startsWith('/blog/categories')) {
      return 'Blog Categories'
    }

    if (pathname.startsWith('/blog/')) {
      return 'Blog Details'
    }

    if (pathname.startsWith('/gallery')) {
      return 'Gallery Management'
    }

    if (pathname.startsWith('/seo/locations')) {
      return 'SEO Locations'
    }

    if (pathname.startsWith('/seo/routes')) {
      return 'SEO Route Pages'
    }

    if (pathname.startsWith('/seo/templates')) {
      return 'SEO Templates'
    }

    if (pathname.startsWith('/seo/pages')) {
      return 'Page SEO'
    }

    if (pathname.startsWith('/seo/redirects')) {
      return 'SEO Redirects'
    }

    if (pathname.startsWith('/seo')) {
      return 'SEO Promotion'
    }

    if (pathname.startsWith('/analytics')) {
      return 'Analytics'
    }

    if (pathname.startsWith('/users')) {
      return 'Users & Roles'
    }

    if (pathname.startsWith('/settings')) {
      return 'Settings'
    }

    return pageTitles[pathname] || 'Admin Panel'
  }

  const currentPageTitle = getCurrentPageTitle()

  useEffect(() => {
    setProfileOpen(false)
    setNotificationOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false)
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ozAdminToken')
    localStorage.removeItem('ozAdminUser')

    toast.success('Logged out successfully.')
    navigate('/login', { replace: true })
  }

  const handleGlobalSearch = (event) => {
    if (event.key !== 'Enter') {
      return
    }

    const searchValue = event.currentTarget.value.trim()

    if (!searchValue) {
      return
    }

    toast(`Search for "${searchValue}" will be connected with admin data.`)
  }

  return (
    <header className="admin-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="header-page-title">
          <p>OZ Interstate Admin</p>
          <h1>{currentPageTitle}</h1>
        </div>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search anything..."
            aria-label="Search admin panel"
            onKeyDown={handleGlobalSearch}
          />
        </div>

        <div className="notification-wrapper" ref={notificationRef}>
          <button
            type="button"
            className="header-icon-button"
            onClick={() => {
              setNotificationOpen((current) => !current)
              setProfileOpen(false)
            }}
            aria-label="Notifications"
            aria-expanded={notificationOpen}
          >
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {notificationOpen && (
            <div className="notification-dropdown">
              <div className="dropdown-heading">
                <div>
                  <strong>Notifications</strong>
                  <span>3 unread messages</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    toast.success('All notifications marked as read.')
                    setNotificationOpen(false)
                  }}
                >
                  Mark all read
                </button>
              </div>

              <div className="notification-list">
                <button
                  type="button"
                  className="notification-item"
                  onClick={() => {
                    navigate('/quotes')
                    setNotificationOpen(false)
                  }}
                >
                  <span className="notification-dot" />

                  <div>
                    <strong>New quote request received</strong>
                    <p>John Smith requested an interstate move.</p>
                    <span>5 minutes ago</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="notification-item"
                  onClick={() => {
                    navigate('/contacts')
                    setNotificationOpen(false)
                  }}
                >
                  <span className="notification-dot" />

                  <div>
                    <strong>New contact message</strong>
                    <p>A customer submitted a website enquiry.</p>
                    <span>28 minutes ago</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="notification-item"
                  onClick={() => {
                    navigate('/testimonials')
                    setNotificationOpen(false)
                  }}
                >
                  <span className="notification-dot" />

                  <div>
                    <strong>Review awaiting approval</strong>
                    <p>A new five-star review was submitted.</p>
                    <span>1 hour ago</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className="header-profile-button"
            onClick={() => {
              setProfileOpen((current) => !current)
              setNotificationOpen(false)
            }}
            aria-label="Open admin profile menu"
            aria-expanded={profileOpen}
          >
            <div className="profile-avatar">
              {user.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>

            <div className="profile-info">
              <strong>{user.name || 'OZ Admin'}</strong>
              <span>{user.role || 'Super Admin'}</span>
            </div>

            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-user">
                <div className="profile-avatar large">
                  {user.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>

                <div>
                  <strong>{user.name || 'OZ Admin'}</strong>
                  <span>{user.email || 'admin@ozinterstate.com'}</span>
                </div>
              </div>

              <div className="profile-dropdown-links">
                <button
                  type="button"
                  onClick={() => {
                    toast('Admin profile page will be added later.')
                    setProfileOpen(false)
                  }}
                >
                  <UserRound size={17} />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/settings')
                    setProfileOpen(false)
                  }}
                >
                  <Settings size={17} />
                  Account Settings
                </button>

                <button
                  type="button"
                  className="logout-menu-button"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header