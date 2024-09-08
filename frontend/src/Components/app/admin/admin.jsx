import React, { useEffect, useState } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';

const Admin = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);

  return (
    <div data-aos="fade-up" className='h-screen text-gray bg-my-image bg-cover flex flex-col  gap-8 px-12 py-2'>
      <div >
        <h1 className='text-2xl font-bold text-gray'>Welcome Adaripon!</h1>
      </div>

      {/* Customers orders */}
      <div className='text-gray'>
        <h1 className='text-lg font-semibold'>Customers Orders</h1>
        <div className='p-8 flex flex-col gap-12 place-items-left'>
          <select name="" id="" className='w-1/2 border rounded border-lime outline-none'></select>
          <div><span>No users transaction found</span></div>
        </div>
      </div>

      {/* Customer disputes */}
      <div className='text-gray'>
        <h1 className='text-lg font-semibold'>Disputes</h1>
        <div className='p-8 flex flex-col gap-12 place-items-left'>
          <select name="" id="" className='w-1/2 border rounded border-lime outline-none'></select>
          <div><span>No users transaction found</span></div>
        </div>
      </div>
      
      {/* This is where the prices of fuel is adjusted*/}
      <div className='text-gray'>
        <h1 className='text-lg font-semibold'>Price Control</h1>
        <div className='p-8 flex flex-col gap-8 place-items-left'>
          <div className='flex flex-row gap-2'>
            <span>Petrol:</span>
            <p>₦870</p>
            <button className='bg-lime text-white px-2 border rounded'>Change</button> 
          </div>
          <div className='flex flex-row gap-2'>
            <span>Diesel:</span>
            <p>₦1250</p>
            <button className='bg-lime text-white px-2 border rounded'>Change</button> 
          </div>
          <div className='flex flex-row gap-2'>
            <span>Kerosene:</span>
            <p>₦1250</p>
            <button className='bg-lime text-white px-2 border rounded'>Change</button>          
          </div>
        </div>
      </div>

      {/* Employee data */}
      <div className='text-gray'>
        <h1 className='text-gray text-lg font-semibold'>Employee</h1>
        <div className='p-8 flex flex-col gap-4 place-items-left'>
          <span>No registered Employee</span>
          <button className='bg-lime w-56 p-2 border rounded text-white'>create employee account</button>
        </div>
      </div>
    </div>
  )
}

export default Admin
