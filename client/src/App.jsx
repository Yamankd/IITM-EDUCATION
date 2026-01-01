import React, { useEffect } from 'react'
import Navbar from './CUSTOM_COMPONENTS/Navbar'
import Routing from './routings/Routing'
import Footer from './CUSTOM_COMPONENTS/Footer'
import Faq from './CUSTOM_COMPONENTS/Faq'
import { useLocation } from 'react-router-dom'

const App = () => {
  const location = useLocation()

  // ✅ detect admin/dashboard routes
  const isDashboard =
    location.pathname.startsWith('/AdminDashboard') ||
    location.pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      {/* ✅ Hide Navbar on dashboard */}
      {!isDashboard && <Navbar />}

      <Routing />

      {/* ✅ Show FAQ only on home */}
      {!isDashboard && location.pathname === '/' && <Faq />}

      {/* ✅ Hide Footer on dashboard */}
      {!isDashboard && <Footer />}
    </>
  )
}

export default App
