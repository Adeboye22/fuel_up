import React from 'react'

const Packages = () => {
  return (
    <div className='flex flex-col gap-4 text-white'>
      <section>
        <h1 className='sm:text-xl sm:font-black text-2xl pb-4'>Packages:</h1>
        <p className='sm:text-base text-lg'>The packages below have been tailored for our daily needs in terms of budget, and emergencies.</p>
      </section>
      <section>
        <div className='p-4 bg-lime text-gray flex flex-col gap-2'>
          <h4 className='font-bold'>Easy Buy:</h4>
          <p>The easy buy package is for users buying below 25 litres without emergencies. Products will be delivered within actual time</p>
          <button className='bg-white border rounded p-2 w-24 left-0'>Purchase</button>
        </div>
      </section>
    </div>
  )
}

export default Packages
