// This is the codebase for About Us
import React, { useEffect } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import App from '../../assets/App.jpeg';

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: false, // Whether animation should happen only once - while scrolling down
    });
  }, []);

  return (
    <div className='flex flex-col gap-12'>
      <div className='flex flex-col gap-4'>
        <h1 className='sm:text-lg text-2xl text-lime font-black'><strong>About Us</strong></h1>
        <span className='sm:text-base text-lg text-white'>
          We are Nigeria's first fuel dispatch service. FuelUp is a reliable door-step fuel delivery service. We offer ease, comfort, and emergency fuel delivery for unexpected situations.
        </span>
      </div>

      <div className='sm:flex-col sm:py-0 py-4 sm:place-items-center sm:gap-12 sm:text-center sm:h-full flex flex-row gap-4 bg-white h-64 p-12 border rounded justify-evenly'>
        <div className='sm:w-full flex flex-col gap-4 w-1/2'>
          <h1 className='sm:text-lg text-2xl text-lime font-black'><strong>Why Fuel Up?</strong></h1>
          <p className='sm:text-base text-lg text-gray'>
            FuelUp delivers fuel to your doorstep, anytime, anywhere. We provide comfort and keep power from going out. You can order online, schedule delivery, and power your home or business. We help keep big businesses (like schools, hotels, fancy restaurants, supermarkets, retail stores, etc) running through our bulk fuel delivery service.
          </p>
        </div>
        <div data-aos="zoom-in" className='w-48 border'>
          <img src={App} alt="" className='sm:my-0 sm:self-center h-60 w-36 -my-10 border solid outline outline-4 rounded-lg border-lime'/>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <h1 className='sm:text-lg text-2xl text-lime font-black'><strong>Benefits</strong></h1>
        <div className='sm:text-base text-lg text-white flex flex-col gap-4'>
        <p>
          Fuel Up offer a range of benefits to both businesses and individual consumers. Here's a breakdown of the key advantages:
        </p>
        <p>
          <strong className='text-lime'>Convenince and Time Savings:</strong> Skip the hassle of waiting in line at gas stations. Fuel Up brings the fuel directly to your location, saving valuabe time and effort. Delivery time is flexible. Prompt fuel delivery ensuring minimal downtime and uninterrupted operations for businesses that rely on generators.
          </p>
          <p>
          <strong className='text-lime'>Cost Savings:</strong> Fuel Up is budget friendly as we care for our users. You don't have to break a bank.
          </p>
          <p>
          <strong className='text-lime'>Improved Efficiency:</strong> Businesses can streamline their operations by outsourcing fuel management. This frees up employee time and optimize their fuel consumption.
          </p>
          <p>
          <strong className='text-lime'>Safety and Reliability:</strong> Our trained professionals handle the transportation and delivery of fuel, ensuring safety and compliance with regulations. Fuel Up provides a guranteed fuel supply, mitigating concerns about shortages or disruptions at gas stations. We often source fuel from reputable filling stations, ensuring consistent quality and performance for your equipment.
        </p>
        <p>
          Overall, Fuel Up offer a win-win situation for both businesses and consumers. We provide convenience, cost-effectiveness, efficiency safety, and even potential environmental benefits.
        </p>
        <div data-aos="slide-right" className='bg-lime opacity-6 p-8 border rounded'>
        <h1 className='text-red font-bold'>Disclaimer Notice:</h1>
        <p className='text-gray'>We do not sell fuel (We are not fuel marketers). We only dispatch fuel based on our clients orders from the nearest filling station.</p>
        </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
