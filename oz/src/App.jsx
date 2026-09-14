import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import FloatingCTA from './components/FloatingCTA'
import Home from './pages/Home'
import CompanyProfile from './pages/CompanyProfile'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import ReviewsPage from './pages/ReviewsPage'
import Blogs from './pages/Blogs'
import Sitemap from './pages/Sitemap'
import ContactPage from './pages/ContactPage'
import Locations from './pages/Locations'
import LocationDetail from './pages/LocationDetail'
import NotFound from './pages/NotFound'
import { pageTransition } from './utils/motion'

function Page({ children }) {
  return (
    <motion.main
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-light">
      <ScrollToTop />
      <Header />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/company-profile" element={<Page><CompanyProfile /></Page>} />
          <Route path="/services" element={<Page><Services /></Page>} />
          <Route path="/services/:slug" element={<Page><ServiceDetail /></Page>} />
          <Route path="/service/:slug" element={<Page><ServiceDetail /></Page>} />
          <Route path="/reviews" element={<Page><ReviewsPage /></Page>} />
          <Route path="/blogs" element={<Page><Blogs /></Page>} />
          <Route path="/locations" element={<Page><Locations /></Page>} />
          <Route path="/location" element={<Page><Locations /></Page>} />
          <Route path="/locations/:slug" element={<Page><LocationDetail /></Page>} />
          <Route path="/location/:slug" element={<Page><LocationDetail /></Page>} />
          <Route path="/sitemap" element={<Page><Sitemap /></Page>} />
          <Route path="/contact" element={<Page><ContactPage /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>

      <Footer />
      <FloatingCTA />
    </div>
  )
}
