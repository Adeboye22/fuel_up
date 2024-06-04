import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import Validate from './ValidateSignup';
import Navbar from './navbar';
import UserValidate from './ValidateSignup';
import axios from'axios';
import Image from '../assets/EcoFuel.gif';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Signup = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);

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
  const [popupVisible, setPopupVisible] = useState('');

  // This function collects the user data
  const handleInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    setValue(prev => {
      return {...prev, [name]: value}
    })
  }

  // This function validates users data then redirect to UserLogin page if successful
  const handleSubmit= async(e) => {
    e.preventDefault();
    setErrors(UserValidate(value));
    setPopupVisible('Submitting...')
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', value)
      setPopupVisible('Account created successfully!');
      setValue({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      });

      window.scrollTo(0, 0); //scroll to the top
    } catch (err) {
      console.log('this is an error', err);
    }
  } 

  // using a setTimeout 

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setErrors(UserValidate(value));
  //   setPopupVisible('loading...')

  //   setTimeout(async () => {
  //     try {
  //       const response = await axios.post('https://fuelup-server.onrender.com/auth/signup', value)
  //       setPopupVisible('Account created successfully!');
  //     } catch (error) {
  //       console.log('Error posting data:', error);
  //     }
  //   }, 60000); 
  // }

  return (
    <div>
      <main  data-aos="fade-up" className='sm:pt-12 bg-black pt-12 p-12 min-h-screen'>
        <div className='flex flex-row justify-center gap-4 pb-8'>
          <h1 className='text-white text-5xl'>Sign Up</h1>
          <img src={Image} alt="" className='sm:h-8 sm:w-8 self-center h-20 w-20 border rounded'/>
        </div>

        {popupVisible && <p className='text-lime text-center'>{popupVisible}</p>}

        <form onSubmit={handleSubmit} className='sm:my-8 sm:px-0 px-8 flex flex-col gap-2'>
          <h3 className='text-white'>First Name:</h3>

          <div className='sm:p-2 sm:gap-2 bg-white border rounded flex place-items-center gap-4 p-3'>
            <FaUser className='text-lime ml-4'/>
            <input type="text" name='firstname' onChange={handleInput} placeholder='first name' className='w-4/5 outline-none p-2' />
          </div>
          {errors.firstname && <span className="text-red">{errors.firstname}</span>}

          <h3 className='text-white'>Last Name:</h3>
          <div className='sm:p-2 sm:gap-2 bg-white border rounded flex place-items-center gap-4 p-3'>
            <FaUser className='text-lime ml-4'/>
            <input type="text" name='lastname' onChange={handleInput} placeholder='last name' className='w-4/5 outline-none p-2'/>
          </div>
          {errors.lastname && <span className="text-red">{errors.lastname}</span>}

          <h3 className='text-white'>Email:</h3>
          <div className='sm:p-2 sm:gap-2 bg-white border rounded flex place-items-center gap-4 p-3'>
            <FaEnvelope className='text-lime ml-4'/>
            <input type="email" name='email' onChange={handleInput} placeholder='email' className='w-4/5 outline-none p-2'/>
          </div>
          {errors.email && <span className = 'text-red'>{errors.email}</span>}

          <h3 className='text-white'>Password:</h3>
          <div className='sm:p-2 sm:gap-2 bg-white border rounded flex place-items-center gap-4 p-3'>
            <FaLock className='text-lime ml-4'/>
            <input type="password" name='password' onChange={handleInput} placeholder='**********' className='w-4/5 outline-none p-2'/>
          </div>
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
