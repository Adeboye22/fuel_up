import React, { useState } from 'react'

const Petrol = () => {
  const Options = [
    { value: 'Option 1', label: "10 Litres", amount:8000  },
    { value: 'Option 2', label: '15 Litres', amount: 12000},
    { value: 'Option 3', label: '20 Litres', amount: 16000}
  ]

  const [select, setSelect] = useState(Options[0].value);
  const [selectedAmount, setSelectedAmount] = useState(Options[0].amount);

  // this function controls the options dropdown
  const handleSelectedOption = (event) => {
    const selectedValue = event.target.value;
    setSelect(selectedValue);
    
    const selectedOption = Options.find(option => option.value === selectedValue);
    setSelectedAmount(selectedOption.amount); //update a selected amount
  }

  // calculates the service charge by 8%
  const charge = selectedAmount * 0.08; 

  // calculates the total bill including the percentage charge
  const total = selectedAmount + charge;

  // this function submits the options chosen
   const handleSubmit = (e) => {
    e.preventDefault();
   }

  return (
    <div className='pt-8'>
      <h1 className='text-lime text-lg font-bold text-center pb-4'>Petrol</h1>
      <form action="" onSubmit={handleSubmit} className='flex flex-col place-items-center gap-2'>
        <select value={select} onChange={handleSelectedOption} className='text-gray w-64 border border-lime outline-0 p-1'>
          {Options.map((option) => (
          <option value={option.value} key={option.value} className='text-gray w-48'>
            {option.label}
          </option>
          ))}
        </select>
        {/* Display the selected amount */}
        <p className='text-gray'> Amount: ₦ <input type="text" value={selectedAmount} readOnly className='text-lime bg-transparent outline-none'/></p>
        {/* Display the service charge by 8% */}
        <p className='text-gray'>Service Charge <span className='text-lime'>(8%)</span>: ₦ <input type="text" value={charge} readOnly className='text-lime outline-none'/></p>
        {/* Display the total amount */}
        <p className='text-gray pt-4'>Total: ₦<input type="text" value={total} readOnly className='text-lime outline-none'/></p>
        <p className='text-gray text-base bg-transparent'>Get a <span className='text-red text-base'>free</span> delivery</p>
        <button type="submit" className='border border-lime rounded outline-dotted outline-2 outline-lime outline-offset-2 w-24'>Order</button>
      </form>
    </div>
  )
}

export default Petrol
