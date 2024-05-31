import React from 'react'
import Navbar from './navbar'

const Header = () => {
  return (
      <header className='sm:p-1 sm:gap-2 bg-white px-10 py-8 fixed w-full flex flex-col gap-8 relative z-20 inset-0'>
        <Navbar />
      </header>
  )
}

export default Header