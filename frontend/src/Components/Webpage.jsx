import React, {useEffect} from 'react'
import Hero from './website/Hero'
import About from './website/AboutUs'
import Services from './website/Services'
import Location from './website/Location'
import Pricing from './website/Pricing'
import OurService from './website/OurService'
import Packages from './website/Packages'
import Marquee from 'react-fast-marquee'
import AOS from 'aos';
import 'aos/dist/aos.css';

const Webpage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);

  return (
    <div data-aos="fade-up" className='sm:pt-0 h-full bg-black pt-0'>
      <div className=''>
        <Marquee className='bg-lime'>
            <p className='text-lg text-gray'> &nbsp; You don't have to compromise your comfort just to get fuel. You order, we deliver!</p>
            <p className='text-lg text-red'>&nbsp; Petrol (PMS) at N665.00, Diesel (AGO) at N1750.00, Kerosene (DPK) at N1450.00.</p>
        </Marquee>
      </div>
      {/* hero section */}
      <section data-aos="fade-up" className='sm:px-4 sm:h-80 px-16 py-14 bg-my-image bg-cover flex flex-col gap-20 space-between h-screen'>
          <Hero/>   
      </section>
      {/* body of the website */}
      <div data-aos="fade-up" className='sm:px-6 flex flex-col px-12 pb-16 gap-12'>
        {/* --our services-- */}
        <section data-aos="fade-up" className='pt-16 flex flex-col'>
          <strong><h1 className='sm:text-xl text-lime text-3xl'>Our Services</h1></strong>
          <div className='my-14 bg-gray w-full py-12'>
            <OurService/>
          </div>
        </section>
        {/* --about-- */}
        <section data-aos="fade-up" id='about'>
          <About/>
        </section>

        {/* --packages-- */}
        <section>
          <Packages/>
        </section>
      </div>
      {/* --footer div-- */}
      <div data-aos="fade-up" className='bg-white flex flex-col'>

        {/* --location-- */}
        <section id='locations' className='bg-black sm:px-8'>
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
