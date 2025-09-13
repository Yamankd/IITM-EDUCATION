import React from 'react'
import { Route, Router } from 'react-router-dom'
import Home from '../CUSTOM_COMPONENTS/Home'
import Courses from '../CUSTOM_COMPONENTS/Courses'
import Team from '../CUSTOM_COMPONENTS/Team'
const Routing = () => {
    return (
        <div>
            <Router>
                <Route path='/' element={<Home />} />
                <Route path='/courses' element={<Courses />} />
                <Route path='/team' element={<Team />} />
            </Router>

        </div >
    )
}

export default Routing
