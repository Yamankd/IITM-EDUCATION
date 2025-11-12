import React from 'react'
import { Route, Routes } from 'react-router-dom' // Import Routes instead of Router
import Home from '../pages/Home'
import Courses from '../pages/Courses'
import Team from '../pages/Team'
import Store from '../pages/Store'
import CourseDetail from '../pages/CourseDetail'
import About from '../pages/About'

const Routing = () => {
    return (
        <Routes> {/* Use Routes instead of Router */}
            <Route path='/' element={<Home />} />
            <Route path='/course' element={<Courses />} />
            <Route path='/team' element={<Team />} />
            <Route path='/store' element={<Store />} />
            <Route path='/about' element={<About />} />
            <Route path='/course/:courseId' element={<CourseDetail />} />
        </Routes>
    )
}

export default Routing