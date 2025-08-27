import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='relative min-h-[6vh] w-screen bg-gray-100'>
        <div className='absolute bottom-0 bg-white min-h-full w-full flex flex-col justify-center items-center shadow rounded-t-4xl py-2 px-5'>
            <h2 className='text-blue-500 text-sm cursor-pointer'>An Aayushman Mukherjee Production</h2>
            <Link to='https://github.com/aayushmanmukherjee' target='_blank'><p className='text-sm rounded-full px-2 py-1 hover:text-white hover:bg-blue-500 transition-all duration-200 cursor-pointer border border-gray-200'>Github</p></Link>
        </div>
      
    </div>
  )
}

export default Footer
