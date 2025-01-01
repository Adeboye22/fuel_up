import React, { useState } from 'react'

const Price = () => {

  const [value, setValue] = useState({
    petrol: '',
    diesel: '',
    kerosene: ''
  })

  // this function handles admin input for fuel prices
  const handleInput = e => {
    setValue(prev => {
      return {...prev, [e.target.name] : [e.target.value]}
    })
  }

  // this function submits the newly inputed values to the backend via axios
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post() //post to api
      setValue({
        petrol: '',
        diesel: '',
        kerosene: ''
      });
    } catch (err) {
      return err
    }
  }
  return(
    <div className='p-8 flex flex-col gap-8 w-full'> 
        <h1 className='text-2xl font-bold'>Price Control</h1>
        <div className='flex flex-col justify-center w-full border mb-12'>
          <div className='grid grid-cols-3 gap-4 text-xl bg-lime p-4 text-center text-white'>
            <h1>Petrol</h1>
            <h1>Diesel</h1>
            <h1>Kerosene</h1>
          </div>
          <div className='grid grid-cols-3 text-lg text-gray text-center border'>
            <span className='border-r-2 p-4'>N1080</span>
            <span className='border-r-2 p-4'>N1750</span>
            <span className='p-4'>N1200</span>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
            <h1 className='text-gray text-xl mb-8'>Change Products Price</h1>
            <form action="" onSubmit={handleSubmit} method="post" className='text-lg flex flex-row justify-between'>
              <label htmlFor="">Petrol</label>
              <input type="number" onChange={handleInput} name="petrol" id=""  className='border rounded' />
              <button type="submit" className='border rounded bg-lime text-white py-0 px-4'>Submit</button>
            </form>
            <form action="" onSubmit={handleSubmit} method="post" className='text-lg flex flex-row justify-between'>
              <label htmlFor="">Diesel</label>
              <input type="number" onChange={handleInput} name="diesel" id=""  className='border rounded' />
              <button type="submit" className='border rounded bg-lime text-white py-0 px-4'>Submit</button>
            </form>
            <form action="" onSubmit={handleSubmit} method="post" className='text-lg flex flex-row justify-between'>
              <label htmlFor="">Kerosene</label>
              <input type="number" onChange={handleInput} name="kerosene" id=""  className='border rounded' />
              <button type="submit" className='border rounded bg-lime text-white py-0 px-4'>Submit</button>
            </form>
          </div>
    </div>
  )
}

export default Price