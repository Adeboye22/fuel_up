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
    <div data-aos="fade-up"className='h-screen px-4 text-gray'>
      <div>
        {users.map((item,index) => (
            <h1 className='text-gray font-bold py-2' key={item.id}>Hi {item.name}!</h1>
        ))}
      </div>
      {/* tab section */}
      <div className='bg-lime sm:h-48 container my-12 mx-auto text-white rounded-lg border border-gray'>
       <Tab tabs={tabs} />
      </div>
      {/* order section */}
      <div className='my-12'>
        <h1 className='text-xl font-bold'>Place Order</h1>
        <div></div>
      </div>
      <div>
        <p>After placing an order, our dispatch agents will contact you for confirmation before delivery.</p>
      </div>
    </div>
  )
}

export default User;