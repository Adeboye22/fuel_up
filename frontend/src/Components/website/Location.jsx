// This is the codebase for Locations
import React from 'react'
import Logistics from '../../assets/Logistics.gif'
import { FaMapPin } from 'react-icons/fa6'
import Marquee from 'react-fast-marquee'

const Location = () => {
  return (
    <div className='sm:p-2 flex flex-col justify-center p-12 text-white'>
      
      <h1 className='sm:text-base text-lg font-bold pb-2'>We deliver to the following areas:</h1>
        <div className='flex flex-col py-6 gap-2'>
          <div className='flex flex-row gap-2'>
            <span className='text-lg'>Lekki Phase 1</span>
            <FaMapPin className='text-red text-xl my-1'/>
          </div>
          <div className='flex flex-row gap-2'>
            <span className='sm:text-base text-lg'>Lekki Phase 2</span>
            <FaMapPin className='sm:text-base text-red text-lg my-1'/>
          </div>
        </div>
      <Marquee>
        <span className='sm:text-base text-lg my-4 text-lime'>...other areas will be announced soon!</span>
      </Marquee>

    </div>
  )
}

export default Location
