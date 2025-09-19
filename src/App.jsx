import React, { useEffect } from 'react'
import Navbar from './CUSTOM_COMPONENTS/Navbar'
import Routing from './routings/Routing'
import Footer from './CUSTOM_COMPONENTS/Footer'
import Faq from './CUSTOM_COMPONENTS/Faq'
import { useLocation } from 'react-router-dom'
import GoBackButton from './CUSTOM_COMPONENTS/goBack'
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
      <GoBackButton/>
      <Footer />
    </>
  )
}

export default App;