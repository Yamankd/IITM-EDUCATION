import React from 'react'
import Navbar from './CUSTOM_COMPONENTS/Navbar'
import Routing from './routings/Routing'
import Footer from './CUSTOM_COMPONENTS/Footer'
import Faq from './CUSTOM_COMPONENTS/Faq'
import { useLocation } from 'react-router-dom'
import ImageCarousel from './CUSTOM_COMPONENTS/ImageCarousel' // Import the carousel

const App = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Routing />
      {location.pathname === '/' && (
        <>
          {/* <HeroSection /> */}
          {/* <FeaturesSection /> */}
          <ImageCarousel /> {/* Add the carousel here */}
          {/* <TestimonialsSection /> */}
          {/* <StatsSection /> */}
          {/* <CoursePreviewSection /> */}
          <Faq />
          {/* <NewsletterSection /> */}
        </>
      )}
      <Footer />
    </>
  )
}

export default App;