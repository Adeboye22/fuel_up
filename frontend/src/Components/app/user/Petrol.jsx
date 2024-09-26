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

  const Options = [{
      "NNPC": [
        { value: 'Option 1', label: "10 Litres", amount:8000  },
        { value: 'Option 2', label: '15 Litres', amount: 12000},
        { value: 'Option 3', label: '20 Litres', amount: 16000}
      ],
      "MOBIL": [
        { value: 'Option 1', label: "10 Litres", amount:8000  },
        { value: 'Option 2', label: '15 Litres', amount: 12000},
        { value: 'Option 3', label: '20 Litres', amount: 16000}
    ],
      "TOTAL": [
        { value: 'Option 1', label: "10 Litres", amount:8000  },
        { value: 'Option 2', label: '15 Litres', amount: 12000},
        { value: 'Option 3', label: '20 Litres', amount: 16000}
      ]
    }];
    
  const [selectedStation, setSelectedStation] = useState('NNPC'); //Default station
  const [selectedOption, setSelectedOption] = useState(Options[0].NNPC[0].value);
  const [selectedAmount, setSelectedAmount] = useState(Options[0].NNPC[0].amount)

  // this function controls the options dropdown
  const handleStationChange = (event) => {
    setSelectedStation(event.target.value);
    setSelectedOption(Options[0][event.target.value][0].value); //Reset selected option when station changes
    
    // const selectedOption = Options.find(option => option.value === selectedValue);
    // setSelectedAmount(selectedOption.amount); //update a selected amount
  }

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    const select = Options.find(option => option.value === selectedValue);
    setSelectedAmount(select.amount); //update a selected amount
  }

  // // calculates the service charge by 8%
  // const charge = selectedAmount * 0.08; 

  // // calculates the total bill including the percentage charge
  // const total = selectedAmount + charge;

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
        {/* Station change */}
        <select value={selectedStation} onChange={handleStationChange} className='text-gray w-64 border border-lime outline-0 p-1'> 
          {Object.keys(Options[0]).map((station) => (
            <option value={station} key={station} className='text-gray text-center w-48'>
              {station}
            </option>
          ))}
        </select>
        {/* change litres */}
        <select value={selectedOption} onChange={handleOptionChange} className='text-gray w-64 border border-lime outline-0 p-1 text-center'>
          {Options[0][selectedStation].map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {/* display price amount of selected litres */}
        <div>
          <span>Amount: </span>
          <span className='text-lime'>N<input type="text" value={selectedAmount} readOnly className='text-lime bg-transparent outline-none w-12'/></span>
        </div>

        <button type="submit" className='border border-lime rounded outline-dotted outline-2 outline-lime outline-offset-2 w-24 mb-4'>Order</button>
      </form>
    </div>
  )
}

export default Petrol
