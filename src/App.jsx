import React, { useEffect } from 'react'
import Navbar from './CUSTOM_COMPONENTS/Navbar'
import Routing from './routings/Routing'
import Footer from './CUSTOM_COMPONENTS/Footer'
import Faq from './CUSTOM_COMPONENTS/Faq'
import { useLocation } from 'react-router-dom'
const App = () => {

  const location = useLocation();
  console.log(location);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname])
  return (
    <>
      <Navbar />
      <Routing />

      {location.pathname === '/' && <Faq />}
      <Footer />
    </>
  )
}

export default App;