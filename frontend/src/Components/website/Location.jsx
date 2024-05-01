// This is the codebase for Locations
import React from 'react'
import Logistics from '../../assets/Logistics.gif'

const Location = () => {
  return (
    <div className='sm:p-2 flex flex-col justify-center p-12 text-white'>
      
      <h1 className='text-3xl font-bold pb-8'>We deliver to the following areas:</h1>
      <div className='flex gap-8'>
        <div className='flex flex-col py-6'> 
          <span className='text-2xl'>Lekki Phase 1</span>
          <span className='text-2xl'>Lekki Phase 2</span>
        </div>
        <div><img src={Logistics} alt="" className='h-24'/></div>
      </div>
      <span className='text-2xl my-12 text-green'>...other areas will be announced soon!</span>
    </div>
  )
}

export default Location
