import React, { useEffect } from 'react'
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
    <div ata-aos="fade-up" className='h-screen text-gray bg-my-image bg-cover px-4'>
      <div>
        <h1>Welcome Adaripon!</h1>
      </div>

      {/* Customer orders */}
      <div>
        <h1>User Orders</h1>
        <div className='p-8 bg-lime'></div>
      </div>

      {/* Customer disputes */}
      <div>
        <h1>Disputes</h1>
        <div className='p-8 bg-lime'></div>
      </div>
      
      {/* This is where the prices of fuel is adjusted*/}
      <div>
        <h1>Price Control</h1>
        <div className='p-8 bg-lime'></div>
      </div>

      {/* Employee data */}
      <div>
        <h1>Employee</h1>
        <div className='p-8 bg-lime'></div>
      </div>
    </div>
  )
}

export default Admin
