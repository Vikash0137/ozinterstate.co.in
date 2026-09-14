import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import About from '../components/About'
import Stats from '../components/Stats'
import Services from '../components/Services'
import WhyChooseUs from '../components/WhyChooseUs'
import MovingProcess from '../components/MovingProcess'
import Locations from '../components/Locations'
import Reviews from '../components/Reviews'
import Gallery from '../components/Gallery'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      {/* Top Hero Banner & Floating Quote Form */}
      <Hero />

      {/* Trust Badges & 4.9/5 Rating Strip */}
      <TrustStrip />

      {/* About Us Section Directly Below Hero */}
      <About />

      {/* Live Statistics Counter */}
      <Stats />

      {/* Removalist Services Grid */}
      <Services />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* 5-Step Moving Process Timeline */}
      <MovingProcess />

      {/* Capital City & Regional Network Hubs */}
      <Locations />

      {/* Customer Reviews Carousel */}
      <Reviews />

      {/* Fleet & Moves Gallery */}
      <Gallery />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* Contact & Consultation Form */}
      <Contact />
    </>
  )
}
