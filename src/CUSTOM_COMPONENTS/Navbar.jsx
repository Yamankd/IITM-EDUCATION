import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className='flex items-center justify-between px-20 py-4 border-b '>
            <div className='text-2xl font-semibold'>Logo</div>
            <div className='flex items-center justify-center gap-10 text-xl'>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/course'>Courses</NavLink>
                <NavLink to='/team'>Team</NavLink>
            </div>
            <button className='px-5 py-2 bg-blue-600 text-white rounded-md cursor-pointer font-bold'>Sign In</button>
        </nav>
    )
}

export default Navbar
