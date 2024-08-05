import React, {useEffect} from 'react';
import Data from '../../Components/app/user.json';
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
      { label: 'Petrol', content: 'The current price for PMS is N680' },
      { label:'Diesel', content: 'The current price for AGO is N1700' },
      { label: 'Kerosene', content: 'The current price for DPK is N1200' }
    ];

  return (
    <div data-aos="fade-up"className='h-screen text-gray bg-my-image bg-cover'>
      <div className='bg-nozzle'>
        <div className="backdrop-filter backdrop-blur-sm px-4 py-4">
          <div>
            {users.map((item,index) => (
                <h1 className='text-gray font-bold py-2' key={item.id}>Hi {item.name}!</h1>
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
          <h1 className='text-xl font-bold'>Place Order</h1>
          <div>

          </div>
        </div>
        <div>
          <p>After placing an order, our dispatch agents will contact you for confirmation before delivery.</p>
        </div>
      </div>
    </div>
  )
}

export default User;