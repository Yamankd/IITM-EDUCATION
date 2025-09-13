import React from 'react'
import { Route, Routes } from 'react-router-dom' // Import Routes instead of Router
import Home from '../pages/Home'
import Courses from '../pages/Courses'
import Team from '../pages/Team'
import Store from '../pages/Store'

const Routing = () => {
    return (
        <Routes> {/* Use Routes instead of Router */}
            <Route path='/' element={<Home />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/team' element={<Team />} />
            <Route path='/store' element={<Store />} />
        </Routes>
    )
}

export default Routing