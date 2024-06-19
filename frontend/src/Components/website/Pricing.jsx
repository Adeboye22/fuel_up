// This is the codebase for Contact Us
import React from 'react'
import Marquee from 'react-fast-marquee'

const ContactUs = () => {
  return (
    <div className='sm:gap-8 text-white bg-black p-8 h-screen'>
      <h1 className='sm:text-xl text-3xl font-black pb-4'>Pricing</h1>
      <p className='pb-8'>Our prices are standard, but flexible to variations. The prices below do not include delivery fee and service charge.</p>
      <Marquee>
      <div className='sm:gap-4 sm:flex-col flex flex-row gap-24 text-lime justify-center text-lg'>
        <div className='flex flex-col'>
          <p>Petrol (PMS)</p>
          <p className='text-red'>N665.00</p>
        </div>
        <div className='flex flex-col'>
          <p>Diesel (AGO)</p>
          <p className='text-red'>N1750.00</p>
        </div>
        <div className='flex flex-col'>
          <p>Kerosene (DPK)</p>
          <p className='text-red'>N1450.00</p>
        </div>
      </div>
      </Marquee>
    </div>
  )
}

export default ContactUs
