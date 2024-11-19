import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();

  const closeTab = () =>{
    return(
      navigate('/user')
    )
  }
  
  return (
    <div className='text-center bg-lime p-8'>
      <div className='flex flex-row justify-center gap-4 relative'>
        <h1 className='text-white text-lg font-bold p-8'>Transaction History</h1>
        <button onClick={closeTab}>
          <FaTimes className='absolute text-red text-xs h-4 text-center top-1.5 right-3'/>
        </button>
      </div>
      <div>  
        <span className='text-gray text-base'>No transaction history</span>
      </div>
    </div>
  )
}

export default History
