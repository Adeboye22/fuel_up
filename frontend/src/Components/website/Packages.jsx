import React from 'react'
import { useNavigate } from 'react-router-dom'

const Packages = () => {
 const  navigate = useNavigate()

  const toLogin = () => {
    navigate('/login')
    window.scrollTo(0, 0);
  }
  return (
    <div className='sm:gap-8 flex flex-col gap-4 text-white'>
      <section className='sm:pb-8'>
        <h1 className='sm:text-xl sm:font-black font-bold text-2xl pb-4'>Packages:</h1>
        <p className='sm:text-base text-lg'>The packages below have been tailored for our daily needs in terms of budget, and emergencies.</p>
      </section>
      <section className='sm:flex-col sm:place-items-center sm:gap-12 flex flex-row gap-2'>
        <div className='sm:border sm:rounded sm:w-3/4 sm:p-8 p-4 bg-lime text-gray flex flex-col gap-2 w-1/2'>
          <h4 className='sm:text-center sm:text-xl font-bold text-2xl'>Easy Buy:</h4>
          <p className='sm:text-center sm:text-base text-lg pb-4'>The easy buy package is for users buying below 25 litres. Products will be delivered within actual time.</p>
          <button onClick={toLogin} className='sm:self-center bg-white border rounded p-2 w-24'>Purchase</button>
        </div>
        <div className='sm:border sm:rounded sm:w-3/4 sm:p-8 p-4 bg-lime text-gray flex flex-col gap-2 w-1/2'>
          <h4 className='sm:text-center sm:text-xl font-bold text-2xl'>Instant Delivery:</h4>
          <p className='sm:text-center sm:text-base text-lg pb-4'>This package is for customers who wants their products delivered almost immediately. Some extra charges will be added.</p>
          <button onClick={toLogin} className='sm:self-center bg-white border rounded p-2 w-24'>Purchase</button>
        </div>
      </section>
      <div className='sm:self-center sm:w-3/4 sm:p-8 sm:border  sm:rounded p-4 bg-lime text-gray flex flex-col gap-2 w-1/2'>
          <h4 className='sm:text-center sm:text-xl font-bold text-2xl'>Bulk Delivery:</h4>
          <p className='sm:text-center sm:text-base text-lg pb-4'>This is for users purchasing more than 25 litres of fuel</p>
          <button onClick={toLogin} className='sm:self-center bg-white border rounded p-2 w-24'>Purchase</button>
        </div>
    </div>
  )
}

export default Packages
