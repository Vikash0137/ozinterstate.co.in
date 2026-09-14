import PageBanner from '../components/PageBanner'
import Contact from '../components/Contact'
import TrustStrip from '../components/TrustStrip'

export default function ContactPage() {
  return (
    <>
      <PageBanner
        title="Contact Us"
        crumb="Contact Us"
        subtitle="Ready to move? Get your free quote today or reach out with any questions — we're here to help."
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=2000&q=80"
      />
      <div className="pt-10">
        <TrustStrip />
      </div>
      <Contact />
    </>
  )
}
