import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Validate from './ValidateLogin';
import Image from '../assets/EcoFuel.gif';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const [value, setValue] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState({});

  const handleInput = e => {
    setValue(prev => {
      return {...prev, [e.target.name]: [e.target.value]}
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(Validate(value))
    axios.post('http://localhost:8080/login', value)
    .then(response => console.log(response))
    .catch(err => console.log(err))
  }

  // const getQuote = () => {
  //   axios.get('https://api.quotable.io/random')
  //   .then(res => {
  //     console.log(res.data.content)
  //     setQuote(res.data.content)
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // }

  return (
    <div className='pt-8 h-full'>
      <main className='sm:h-full sm:w-full bg-black p-20 min-h-screen pb-40'>
        <div className='sm:mt-24 flex flex-row justify-center'>
          <img src={Image} alt="" className='sm:h-12 sm:w-12 h-20 w-20 border rounded'/>
        </div>

        <form  className='sm:mt-8 flex flex-col gap-4 pt-8'>
          <label htmlFor="email" className='text-white text-xl'>user email: </label>

          <div className='sm:p-2 sm:gap-2 bg-white border rounded flex place-items-center gap-4 p-3'>
            <FaEnvelope className='text-lime'/>
            <input type="email" name='email' onChange={handleInput} placeholder="youremail@gmail.com" className='outline-none w-4/5 p-2'/>
          </div>
          {error.email && <span className = 'text-lime'>{error.email}</span>}

          <label htmlFor="" className='text-white text-xl'>password: </label>
          <div className='sm:p-2 sm:gap-2 bg-white border rounded flex place-items-center gap-4 p-3'>
            <FaLock className='text-lime'/>            
            <input type="password" name="password" onChange={handleInput} placeholder="*********" className='outline-none w-4/5 p-2'/>
          </div>
          {error.password && <span className = 'text-red'>{error.password}</span>}

          <div className='grid'>
            <button className='sm:w-20 sm:text-base text-white bg-lime p-2 text-xl border-white border-2 w-32 place-self-center rounded mt-4 font-bold justify-center' type='submit'>Login </button>
          </div>
        </form>
      </main>

    </div>
  )
}

export default Login;
