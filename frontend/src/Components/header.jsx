import React from 'react'
import Navbar from './navbar'
import Marquee from 'react-fast-marquee'

const Header = () => {
  return (
    <header className='sm:p-1 sm:gap-2 bg-white px-10 py-8 fixed w-full flex flex-col gap-8'>
      <Navbar/>
      <Marquee className='bg-lime'>
        <p className='text-lg text-gray'>You don't have to compromise your comfort just to get fuel. You order, we deliver!</p>
      </Marquee>
    </header>
  )
}

export default Header