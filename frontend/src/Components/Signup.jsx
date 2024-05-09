import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import Validate from './ValidateSignup';
import Navbar from './navbar';
import UserValidate from './ValidateSignup';
import axios from'axios';
import Image from '../assets/EcoFuel.gif';
import Image2 from '../assets/EcoFuel1.gif';

const Signup = () => {

  // this objects stores the user data
  const [value, setValue] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });

  // use this hook to route to the redirect mail page
  const navigate = useNavigate();

  // This object collects the error data
  const [errors, setErrors] = useState({});

  // This hook handles the text display on successful user creation
  const [popupVisible, setPopupVisible] = useState(false);

  // This function collects the user data
  const handleInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    setValue(prev => {
      return {...prev, [name]: value}
    })
  }

  const [text, setText] = useState('Initial Text');
  const texts = ['Welcome', 'to', 'FuelUp.', 'Kindly', 'signup', 'to', 'continue']
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

  // This function validates users data then redirect to UserLogin page if successful
  const handleSubmit= async(e) => {
    e.preventDefault();
    setErrors(UserValidate(value));
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', value)
      setPopupVisible(true);
    } catch (err) {
      console.log('this is an error', err);
    }
  } 

  return (
    <div className='pt-12'>
      <main className='bg-black p-12 min-h-screen'>
        <div className='flex flex-row justify-center'>
          <div className='sm:h-16 sm:w-16 sm:text-sm sm:p-4 h-20 w-20 p-4 border rounded bg-lime flex justify-center my-12 text-base text-white font-bold'>{text}</div>
          <img src={Image2} alt="" className='sm:h-16 sm:w-16 h-20 w-20 border rounded'/>
        </div>

        {popupVisible && (
        <div className='text-white text-center'>
          <p>Account created successfully!</p>
        </div>
      )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <h3 className='text-white'>First Name:</h3>
          <input type="text" name='firstname' onChange={handleInput} placeholder='first name' 
          className='sm:p-1 border rounded border-gray p-2'/>
          {errors.firstname && <span className="text-red">{errors.firstname}</span>}
          <h3 className='text-white'>Last Name:</h3>
          <input type="text" name='lastname' onChange={handleInput} placeholder='last name' className='sm:p-1 border rounded border-gray p-2'/>
          {errors.lastname && <span className="text-red">{errors.lastname}</span>}
          <h3 className='text-white'>Email:</h3>
          <input type="email" name='email' onChange={handleInput} placeholder='email' className='sm:p-1 border rounded border-gray p-2'/>
          
          {errors.email && <span className = 'text-red'>{errors.email}</span>}
          <h3 className='text-white'>Password:</h3>
          <input type="password" name='password' onChange={handleInput} placeholder='**********' className='sm:p-1 border rounded border-gray p-2'/>
          {errors.password && <span className = 'text-red'>{errors.password}</span>}
          <div className='grid'>
            <button className='text-white bg-lime p-2 text-xl border-white border-2 w-32 place-self-center rounded mt-4 flex gap-2 font-bold justify-center' type='submit'>Signup </button>
          </div>
        </form>
      </main>
    </div>
  )
}
export default Signup
