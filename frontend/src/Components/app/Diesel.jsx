import React, { useState } from 'react'

const Diesel = () => {
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
      <form action="" onSubmit={handleSubmit} className='flex flex-col place-items-center gap-8'>
        <select value={select} onChange={handleSelectedOption} className='text-gray w-64 border border-lime outline-0 p-1'>
          {Options.map((option) => (
          <option value={option.value} key={option.value} className='text-gray w-48'>
            {option.label}
          </option>
          ))}
        </select>
        <button type="submit" className='border border-lime rounded outline-double outline-2 outline-lime outline-offset-2 w-24'>Order</button>
      </form>
    </div>
  )
}

export default Diesel
