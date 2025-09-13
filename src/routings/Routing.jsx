import React from 'react'
import { Route, Router } from 'react-router-dom'
import Home from '../pages/Home'
import Courses from '../pages/Courses'
import Team from '../pages/Team'
import Store from '../pages/Store'
const Routing = () => {
    return (
        <div>
            <Router>
                <Route path='/' element={<Home />} />
                <Route path='/courses' element={<Courses />} />
                <Route path='/store' element={<Courses />} />
                <Route path='/team' element={<Team />} />
                <Route path='/store' element={<Store />} />
            </Router>
        </div>
    )
}

export default Routing
