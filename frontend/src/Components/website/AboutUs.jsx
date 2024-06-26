// This is the codebase for About Us
import React from 'react'

const AboutUs = () => {
  return (
    <div className='flex flex-col gap-12'>
      <div className='flex flex-col gap-4'>
        <h1 className='sm:text-lg text-2xl text-lime font-black'><strong>About Us</strong></h1>
        <span className='sm:text-base text-lg text-white'>
          No more fuel stress! FuelUp delivers fuel to your doorstep, anytime. We ease the struggle of unreliable power in Nigeria with convenient online ordering and reliable delivery.Businesses? We offer bulk fuel deliveries to keep you running. FuelUp: Your dependable fuel solution.
        </span>
      </div>
      <div className='flex flex-col gap-4'>
        <h1 className='sm:text-lg text-2xl text-lime font-black'><strong>Why Fuel Up?</strong></h1>
        <p className='sm:text-base text-lg text-white'>
          FuelUp delivers fuel to your doorstep, anytime, anywhere. No more stress about power outages or unreliable stations. Order online, schedule delivery, and power your home or business.
        </p>
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
          <strong className='text-lime'>Cost Savings:</strong> Fuel Up offers the best price you can get anywhere. You'll be getting the best price at your conevenience.
          </p>
          <p>
          <strong className='text-lime'>Improved Efficiency:</strong> Businesses can streamline their operations by outsourcing fuel management. This frees up employee time and optimize their fuel consumption.
          </p>
          <p>
          <strong className='text-lime'>Safety and Reliability:</strong> Trained professionals handle the transortation and delivery of fuel, ensuring safety and compliance with regulations. Fuel Up will provide a guranteed fuel supply, mitigating concerns about shortages or disruptions at gas stations. We often source fuel from reputable suppliers, ensuring consistent quality and performance for your equipment.
        </p>
        <p>
          Overall, Fuel Up offer a win-win situation for both businesses and consumers. We provide convenience, cost-effectiveness, efficiency safety, and even potential environmental benefits.
        </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
