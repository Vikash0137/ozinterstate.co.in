import {
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleGauge,
  ClipboardList,
  FileText,
  GalleryHorizontal,
  History,
  Image,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  PackageSearch,
  Quote,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Users,
  X,
  Globe,
  Truck,
} from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ozLogo from '../../assets/oz-logo.png'
import './Sidebar.css'

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    label: 'Inquiry',
    icon: ClipboardList,
    children: [
      { label: 'Form Builder', path: '/inquiries/builder' },
      { label: 'Inquiry List', path: '/inquiries' },
      { label: 'Inquiry Settings', path: '/inquiries/settings' },
    ],
  },

  {
    label: 'Customers',
    icon: Users,
    children: [
      { label: 'All Customers', path: '/customers' },
      { label: 'New Customer', path: '/customers/new' },
    ],
  },
  {
    label: 'Admin Management',
    icon: ShieldCheck,
    children: [
      { label: 'All Admins', path: '/admins' },
      { label: 'New Admin', path: '/admins/new' },
    ],
  },
  {
    label: 'Activity Logs',
    icon: History,
    path: '/activity-logs',
  },
  {
    label: 'Notifications',
    icon: Bell,
    path: '/notifications',
  },
  {
    label: 'Locations & SEO',
    icon: MapPin,
    children: [
      { label: 'All Locations', path: '/admin/locations' },
      { label: 'Add Location', path: '/admin/locations/new' },
      { label: '301 Redirects', path: '/admin/locations/redirects' },
      { label: 'Location Analytics', path: '/admin/locations/analytics' },
    ],
  },
  {
    label: 'Services & SEO',
    icon: Truck,
    children: [
      { label: 'All Services & SEO', path: '/admin/services' },
      { label: 'Add Service & SEO', path: '/admin/services/new' },
    ],
  },
  {
    label: 'Contact Messages',
    icon: MessageSquareText,
    path: '/contacts',
  },
  {
    label: 'Website CMS',
    icon: Globe,
    children: [
      { label: 'Banner Management', path: '/banners' },
      { label: 'Site Settings', path: '/cms/site-settings' },
      { label: 'SEO Settings', path: '/cms/seo-settings' },
      { label: 'Pages & Sections', path: '/cms/pages' },
      { label: 'Services', path: '/cms/services' },
      { label: 'Add Service', path: '/cms/services/create' },
      { label: 'Blogs', path: '/cms/blogs' },
      { label: 'Testimonials / Reviews', path: '/cms/reviews' },
      { label: 'FAQs', path: '/cms/faqs' },
      { label: 'Gallery', path: '/cms/gallery' },
      { label: 'Add Gallery Image', path: '/cms/gallery/create' },
      { label: 'Team', path: '/cms/team' },
      { label: 'Trust Badges', path: '/cms/trust-badges' },
      { label: 'Stats', path: '/cms/stats' },
      { label: 'Process Steps', path: '/cms/process-steps' },
      { label: 'Why Choose Us', path: '/cms/why-choose' },
    ],
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
  },
  {
    label: 'Users & Roles',
    icon: ShieldCheck,
    path: '/users',
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/settings',
  },
]

const SidebarMenuItem = ({ item, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = item.icon

  if (item.children) {
    return (
      <div className="sidebar-menu-group">
        <button
          type="button"
          className={`sidebar-menu-button ${isOpen ? 'active-group' : ''}`}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sidebar-menu-left">
            <Icon size={19} />
            <span>{item.label}</span>
          </span>

          <ChevronDown
            size={16}
            className={`sidebar-arrow ${isOpen ? 'rotate' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="sidebar-submenu">
            {item.children.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `sidebar-submenu-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="submenu-dot" />
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `sidebar-menu-button sidebar-link ${isActive ? 'active' : ''}`
      }
    >
      <span className="sidebar-menu-left">
        <Icon size={19} />
        <span>{item.label}</span>
      </span>
    </NavLink>
  )
}

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-brand" onClick={onClose} aria-label="Go to Dashboard">
            <div className="sidebar-brand-logo">
              <img src={ozLogo} alt="OZ Interstate Movers" />
            </div>
          </Link>

          <button
            type="button"
            className="sidebar-close-button"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={21} />
          </button>
        </div>

        <div className="sidebar-company-card">
          <div className="company-card-icon">
            <CircleGauge size={20} />
          </div>

          <div>
            <strong>Business Control</strong>
            <span>All systems operational</span>
          </div>
        </div>

        <nav className="sidebar-navigation">
          <p className="sidebar-section-title">Main Navigation</p>

          <div className="sidebar-menu-list">
            {menuItems.map((item) => (
              <SidebarMenuItem
                key={item.label}
                item={item}
                onNavigate={onClose}
              />
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-icon">
            <PackageSearch size={20} />
          </div>

          <div>
            <strong>OZ Interstate</strong>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}
    </>
  )
}

export default Sidebar