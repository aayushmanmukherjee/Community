import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='min-h-[6vh] w-screen bg-gray-100'>
    <nav className='bg-white min-h-full w-full flex justify-between items-center shadow rounded-b-4xl py-2 px-5'>
      <NavLink to='/'><h1 className='text-blue-500 text-5xl max-md:text-3xl max-sm:xl font-bold cursor-pointer'>Community</h1></NavLink>
      <NavLink to='/profile'><button className='border border-gray-200 max-sm:text-sm max-sm:py-1 px-2 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200 text-xl cursor-pointer'>Profile</button></NavLink>
    </nav>
    </div>
  )
}

export default Navbar
