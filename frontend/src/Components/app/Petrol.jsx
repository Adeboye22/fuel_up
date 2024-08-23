import React, { useState } from 'react'

const Petrol = () => {
  const Options = [
    { value: 'Option 1', label: "10 Litres"},
    { value: 'Option 2', label: '15 Litres'},
    { value: 'Option 3', label: '20 Litres'}
  ]

  const [select, setSelect] = useState(Options[0].value)

  // this function controls the options dropdown
  const handleSelectedOption = (event) => {
    setSelect(event.target.value)
  }

  // this function submits the options chosen
   const handleSubmit = (e) => {
    e.preventDefault();
   }

  return (
    <div className='pt-8'>
      <h1 className='text-lime text-lg font-bold text-center pb-4'>Petrol</h1>
      <form action="" onSubmit={handleSubmit} className='flex flex-col place-items-center gap-8'>
        <select value={select} onChange={handleSelectedOption} className='text-gray w-64 border border-lime outline-0 p-1'>
          {Options.map((option) => (
          <option value={option.value} key={option.value} className='text-gray w-48'>
            {option.label}
          </option>
          ))}
        </select>
        <p className='text-gray text-base'>Delivery fee is <span className='text-red text-base'>N150</span></p>
        <button type="submit" className='border border-lime rounded outline-dotted outline-2 outline-lime outline-offset-2 w-24'>Order</button>
      </form>
    </div>
  )
}

export default Petrol
