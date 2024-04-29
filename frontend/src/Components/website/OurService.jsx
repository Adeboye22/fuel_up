import React from 'react'
import {} from 'react-icons/fa'
import FD from '../../assets/Refuel.gif'
import Clock from '../../assets/Clock.gif'
import Access from '../../assets/Smartphone.gif'
import Bulk from '../../assets/Pallete.gif'
import QA from '../../assets/QualityAssurance.gif'
import CS from '../../assets/CustomerSupport.gif'


const OurService = () => {
  return (
    <div className='flex flex-col gap-4'>
        <div className='flex flex-row gap-2 self-center'>

            {/* --fuel dispensing-- */}
            <a href="#fuel_dispensing">
              <div className='sm:h-20 sm:w-20 bg-white h-28 w-28  p-2 flex flex-col overflow-hidden hover:border hover:rounded hover:h-40 hover:w-40'>
                  <img src={FD} alt="" className='sm:h-8 sm:w-8 h-16 w-16 hover:h-28 hover:w-28 self-center'/>
                  <span className='text-altBlack text-xs self-center font-medium'>Fuel Dispensing</span>
              </div>
            </a>

            {/* --24/7 Availability-- */}
            <a href="#availability">
              <div className='sm:h-20 sm:w-20 bg-white h-28 w-28  p-2 flex flex-col overflow-hidden hover:border hover:rounded hover:h-40 hover:w-40'>
                <img src={Clock} alt="" className='sm:h-8 sm:w-8 h-16 w-16  hover:h-28 hover:w-28 self-center'/>
                <span className='text-altBlack text-xs self-center font-medium'>24/7 Availability</span>           
              </div>
            </a>

            {/* --convenience and accessibility-- */}
            <a href="#accessibility">
              <div className='sm:h-20 sm:w-20 bg-white h-28 w-28  p-2 flex flex-col overflow-hidden hover:border hover:rounded hover:h-40 hover:w-40'>
                <img src={Access} alt="" className='sm:h-8 sm:w-8 h-16 w-16  hover:h-28 hover:w-28 self-center'/>
                <span className='sm:pt-4 text-altBlack text-xs self-center font-medium'>Accesibility</span>
              </div>
            </a>

        </div>
        <div className='flex flex-row gap-2 self-center'>

          {/* --bulk fuel delivery-- */}
          <a href="#bulk_delivery">
            <div className='sm:h-20 sm:w-20 bg-white h-28 w-28 p-2 flex flex-col overflow-hidden hover:border hover:rounded hover:h-40 hover:w-40'>
                <img src={Bulk} alt="" className='sm:h-8 sm:w-8 h-16 w-16  hover:h-28 hover:w-28 self-center'/>
                <span className='sm:pt-2 text-altBlack text-xs self-center font-medium'>Bulk Fuel Delivery</span>
            </div>
          </a>

          {/* --quality assurance-- */}
          <a href="#quality_assurance">
            <div className='sm:h-20 sm:w-20 bg-white h-28 w-28 p-2 flex flex-col overflow-hidden hover:border hover:rounded hover:h-40 hover:w-40'>
              <img src={QA} alt="" className='sm:h-8 sm:w-8 h-16 w-16  hover:h-28 hover:w-28 self-center'/>
              <span className='sm:pt-2 text-altBlack text-xs self-center font-medium'>Quality Assurance</span>               
            </div>
          </a>

          {/* --customer support-- */}
          <a href="#customer_care">
            <div className='sm:h-20 sm:w-20 bg-white h-28 w-28  p-2 flex flex-col overflow-hidden hover:border hover:rounded hover:h-40 hover:w-40'>
              <img src={CS} alt="" className='sm:h-8 sm:w-8 h-16 w-16 hover:h-28 hover:w-28 self-center'/>
              <span className='sm:pt-2 text-altBlack text-xs self-center font-medium'>Customer Support</span> 
            </div>
          </a>
        </div>
    </div>
  )
}

export default OurService
