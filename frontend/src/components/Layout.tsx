import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DocumentHead } from './DocumentHead'
import { Footer } from './Footer'
import { Navigation } from './Navigation'
import { ScrollToTop } from './ScrollToTop'

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <DocumentHead />
      <ScrollToTop />
      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
