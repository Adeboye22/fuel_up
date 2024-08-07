import React, {useEffect} from 'react';
import Data from '../../Components/app/user.json';
import Diesel from '../../assets/Refuel.gif'
import Kerosene from'../../assets/EcoFuel.gif'
import Petrol from'../../assets/EcoFuel1.gif'
import Bulk from '../../assets/Pallete.gif'
import Tab from './Tab';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
      <div className="px-2">
        {/* order section */}
        <div className='my-8'>
          <h1 className='text-xl font-bold pb-8'>Place Order</h1>
          <div className='flex flex-row justify-evenly pb-8'>
            <div className='flex flex-col gap-4'>
              <h1 className="text-center">Petrol</h1>
              <div className='bg-white p-2 overflow-hidden outline outline-offset-2 outline-lime border border-lime rounded-full'><img src={Petrol} alt="" className='h-8 w-8'/></div>
            </div>
            
            <div className='flex flex-col gap-4'>
              <h1 className="text-center">Diesel</h1>
              <div className='bg-white p-2 overflow-hidden outline outline-offset-2 outline-lime border border-lime rounded-full'><img src={Diesel} alt="" className='h-8 w-8'/></div>
            </div>

            <div className='flex flex-col gap-4'>
              <h1 className="text-center">Kero</h1>
              <div className='bg-white p-2 overflow-hidden outline outline-offset-2 outline-lime border border-lime rounded-full'><img src={Kerosene} alt="" className='h-8 w-8'/></div>
            </div>

          </div>
        </div>
        <div>
          <h1 className='text-xl font-bold pb-2'>Note</h1>
          <p>After placing an order, our dispatch agents will contact you for confirmation before delivery.</p>
        </div>
      </div>
    </div>
  )
}

export default User;