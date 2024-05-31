import React from 'react'
import Hero from './website/Hero'
import About from './website/AboutUs'
import Services from './website/Services'
import Location from './website/Location'
import Pricing from './website/Pricing'
import OurService from './website/OurService'
import Packages from './website/Packages'
import Marquee from 'react-fast-marquee'

const Webpage = () => {
  return (
    <div className='sm:pt-0 h-full bg-black pt-0'>
      <div className=''>
        <Marquee className='bg-lime'>
            <p className='text-lg text-gray'> &nbsp; You don't have to compromise your comfort just to get fuel. You order, we deliver!</p>
        </Marquee>
      </div>
      {/* hero section */}
      <section className='sm:px-4 sm:h-80 px-16 py-14 bg-my-image bg-cover flex flex-col gap-20 space-between h-screen'>
          <Hero/>
      </section>
      {/* body of the website */}
      <div className='sm:px-6 flex flex-col px-12 pb-16 gap-28'>
        {/* --our services-- */}
        <section className='pt-16 flex flex-col'>
          <strong><h1 className='sm:text-xl text-white text-3xl'>Our Services</h1></strong>
          <div className='my-14 bg-gray w-full py-12'>
            <OurService/>
          </div>
        </section>
        {/* --about-- */}
        <section id='about' className='py-16'>
          <About/>
        </section>

        {/* pricing */}
        <section>
          <Pricing />
        </section>

        {/* --packages-- */}
        <section className='py-16'>
          <Packages/>
        </section>

        {/* --services-- */}
        <section id='services' className='p-2'>
          <Services/>
        </section>
      </div>
      {/* --footer div-- */}
      <div className='bg-white flex flex-col'>

        {/* --location-- */}
        <section id='locations' className='bg-black sm:px-8 p-16'>
          <Location/>
        </section>

        {/* --line breaker-- */}
        <div className='px-8'>
          <hr className='sm:hidden text-black pb-8' />
        </div>
      </div>
    </div>
  )
}

export default Webpage
