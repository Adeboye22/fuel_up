import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Petrol = () => {
  const navigate = useNavigate();

  const closeTab = () =>{
    return(
      navigate('/user')
    )
  }

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
    <div className='mt-2 border rounded-lg border-gray'>
      <div className='bg-lime mb-8 flex flex-row justify-center gap-4 relative'>
        <h1 className='text-white text-lg font-bold text-center'>Petrol</h1>
        <button onClick={closeTab}>
          <FaTimes className='absolute text-red text-xs h-4 text-center top-1.5 right-3'/>
        </button>
      </div>
      <form action="" onSubmit={handleSubmit} className='flex flex-col place-items-center gap-2'>
        <select value={select} onChange={handleSelectedOption} className='text-gray w-64 border border-lime outline-0 p-1'>
          {Options.map((option) => (
          <option value={option.value} key={option.value} className='text-gray w-48'>
            {option.label}
          </option>
          ))}
        </select>
        {/* Display the selected amount */}
        <p className='text-gray'> Amount: ₦ <input type="text" value={selectedAmount} readOnly className='text-lime bg-transparent outline-none w-12'/></p>

        {/* Display the service charge by 8% */}
        <p className='text-gray'>Service Charge <span className='text-lime'>
          (8%)</span>: ₦ <input type="text" value={charge} readOnly className='text-lime outline-none w-12'/>
        </p>

        {/* Display delivery fee */}
        <p className='text-gray text-base bg-transparent'>
           Delevery fee: ₦ <input type="text" value="0" readOnly className='text-lime outline-none w-12'/>
        </p>
        {/* Display the total amount */}
        <p className='text-gray pt-4'>Total: ₦<input type="text" value={total} readOnly className='text-lime outline-none w-12'/></p>
        <button type="submit" className='border border-lime rounded outline-dotted outline-2 outline-lime outline-offset-2 w-24'>Order</button>
      </form>
    </div>
  )
}

export default Petrol
