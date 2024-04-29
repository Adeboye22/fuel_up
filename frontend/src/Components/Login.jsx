import React, { useState, useEffect } from 'react';
// import Axios from 'axios';
import Validate from './ValidateLogin';
import Image from '../assets/EcoFuel.gif';
import Image2 from '../assets/EcoFuel1.gif';

const Login = () => {
  const [text, setText] = useState('Initial Text');
  const texts = ['Welcome', 'back', 'to', 'FuelUp']
  const [ index, setIndex ] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment the index and loop back to 0 if it extends the array length
      setIndex(prevIndex => (prevIndex + 1) % texts.length);
    }, 1000);  //Change text every 10 seconds

    // clean up the interval when the components unmounts
    return () => clearInterval(interval);
  }, []); //Run effect only once on a computer mount

  useEffect(() => {
    // Update the text when the index charges
    setText(texts[index]);
  }, [index, texts]);

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
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setError(Validate(value))
  //   axios.post('http://localhost:8080/login', value)
  //   .then(response => console.log(response))
  //   .catch(err => console.log(err))
  // }

  return(
    <div className='pt-12'>
      <main className='sm:h-full sm:w-full bg-black p-24 min-h-screen pb-40'>
        <div className='flex flex-row justify-center'>
          <div className='h-24 w-24 p-8 border rounded bg-lime flex justify-center my-12 text-xl text-white font-bold'>{text}</div>
          <img src={Image2} alt="" className='h-24 w-24 border rounded'/>
        </div>
        <form  className='flex flex-col gap-4 pt-8'>
          <label htmlFor="email" className='text-white text-xl'>user email: </label>
          <input type="email" name='email' onChange={handleInput} placeholder="youremail@gmail.com" className='sm:p-2 border border-gray rounded p-4'/>
          {error.email && <span className = 'text-lime'>{error.email}</span>}
          <label htmlFor="" className='text-white text-xl'>password: </label>
          <input type="password" name="password" onChange={handleInput} placeholder="*********" className='sm:p-2 border border-gray-100 rounded p-4'/>
          {error.password && <span className = 'text-red'>{error.password}</span>}
          <div className='grid'>
            <button className='sm:w-24 sm:text-base text-white bg-lime p-2 text-xl border-white border-2 w-40 place-self-center rounded mt-4 font-bold justify-center' type='submit'>Login </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Login;
