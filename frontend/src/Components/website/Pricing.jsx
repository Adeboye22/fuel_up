// This is the codebase for Contact Us
import React from 'react'
import Marquee from 'react-fast-marquee'

const ContactUs = () => {
  return (
    <div className='sm:gap-8 text-white flex flex-col gap-24'>
      <h1 className='sm:text-xl text-3xl font-black'>Pricing</h1>
      <Marquee>
      <div className='sm:gap-12 sm:flex-col flex flex-row gap-24 text-lime justify-center text-lg'>
        <div className='flex flex-col'>
          <p>Petrol (PMS)</p>
          <p className='text-red'>N665.00</p>
        </div>
        <div className='flex flex-col'>
          <p>Diesel (DPK)</p>
          <p className='text-red'>N1750.00</p>
        </div>
        <div className='flex flex-col'>
          <p>Kerosene (AGO)</p>
          <p className='text-red'>N1450.00</p>
        </div>
      </div>
      </Marquee>
    </div>
  )
}

export default ContactUs
