import React, { useEffect } from 'react';
import Data from '../../Components/app/user.json';
import Diesel from '../../assets/Refuel.gif'
import Kerosene from'../../assets/EcoFuel.gif'
import Petrol from'../../assets/EcoFuel1.gif'
import Tab from './Tab';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link, Outlet } from 'react-router-dom'
import { FaClock } from 'react-icons/fa6';

const User = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);

    const {users} = Data;
    const tabs = [
      { label: 'Petrol', content: 'The current price for PMS is N680', note:'We only dispatch a maximum of 20 litres'},
      { label:'Diesel', content: 'The current price for AGO is N1700', note:'Will soon be available'},
      { label: 'Kerosene', content: 'The current price for DPK is N1200', note:'Not available at the moment' }
    ];

  return (
    <div data-aos="fade-up"className='h-screen text-gray bg-my-image bg-cover'>
      <div className='bg-nozzle'>
        <div className="backdrop-filter backdrop-blur-sm px-4 py-4">
          <div>
            {users.map((item,index) => (
                <h1 className='text-gray font-bold text-xl py-2' key={item.id}>Hi {item.name}!</h1>
            ))}
          </div>
          {/* tab section */}
          <div className="bg-nozzle">
            <div className='bg-lime backdrop-filter backdrop-filter-sm bg-opacity-30 sm:h-48 container my-4 mx-auto text-white rounded-lg border border-gray'>
            <Tab tabs={tabs} />
            </div>
          </div>
        </div>
      </div>
      <div className="px-4">
        {/* order section */}
        <div className='my-8'>
          <div className='flex flex-row pb-12 justify-between'>
            <h1 className='text-xl font-bold'>Place Order</h1>
            <div className='flex flex-row gap-2'>
              <span className='mt-1 text-base text-red'>transaction history</span>
              <FaClock className='text-lime mt-2'/>
            </div>
          </div>
          <div className='flex flex-row justify-evenly pb-8'>
            <div className='flex flex-col gap-4'>
              <h1 className="text-center">Petrol</h1>

              {/* Petrol routing order */}
              <Link to='/user/orderPetrol'>
              <div className='bg-white p-2 overflow-hidden outline outline-lime outline-offset-2 border border-lime rounded-full' ><img src={Petrol} alt="" className='h-8 w-8'/></div>
              </Link>
              

            </div>
            
            {/* Diesel routing order */}
            
              <div className='flex flex-col gap-4'>
                <h1 className="text-center">Diesel</h1>
                <Link to='/user/orderDiesel'>
                  <div className='bg-white p-2 overflow-hidden outline outline-offset-2 outline-lime border border-lime rounded-full'><img src={Diesel} alt="" className='h-8 w-8'/></div>
                </Link>
              </div>

            {/* Kerosene routing order*/}
            <div className='flex flex-col gap-4'>
              <h1 className="text-center">Kero</h1>
              <Link to='/user/orderKero'>
                <div className='bg-white p-2 overflow-hidden outline outline-offset-2 outline-lime border border-lime rounded-full'><img src={Kerosene} alt="" className='h-8 w-8'/></div>
              </Link>
            </div>

          </div>

          <Outlet/>
        </div>
        <div className='pb-12'>
          <h1 className='text-xl font-bold pb-2'>Note</h1>
          <p>After placing an order, our dispatch agents will contact you for confirmation before delivery.</p>
        </div>
      </div>
    </div>
  )
}

export default User;