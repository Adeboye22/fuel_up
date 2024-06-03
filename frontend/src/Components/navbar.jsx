import React, {useState} from 'react'
import Logo from '../assets/Logo.png'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaBars, FaTimesCircle } from 'react-icons/fa';

const NavBar = () => {
  const navigate = useNavigate();
  
  // this function is for the login button
  const login = () => {
    return(
      navigate('/login')
    )
  }

  const closeNavBar = () => {
    setIsOpen(false)
  }

  const activeNav = ({isActive}) => {
    return{
      textDecorationLine: isActive? "underline": "none"
    }
  }

  return (
    <div className='flex flex-row justify-between bg-white mt-4'>
        <div>
            <NavLink to="/"><img src={Logo} className='sm:hidden md:hidden h-12 w-16 -my-8' /></NavLink>
        </div>
        <div className={`sm:fixed sm:top-4 sm:left-0 sm:bg-white sm:h-full sm:w-3/4 sm:text-base  sm:text-center sm:p-16 text-lg -my-4`}>
            <ul className='sm:flex sm:flex-col sm:gap-4 sm:my-36 text-gray flex flex-row gap-8 font-medium'>
              <li><NavLink to="/" onClick={closeNavBar} style={activeNav}>Home</NavLink></li>
              <a href="#about" className='sm:hidden'><li>About Us</li></a>
              <a href="#services" className='sm:hidden'><li>Services</li></a>
              <a href="#locations" className='sm:hidden'><li>Locations</li></a>
              <button onClick={login} className='sm:hidden bg-black px-4 py-2 -mt-2 text-white border rounded'>Login</button>
              <li className='sm:block hidden'><NavLink to="login" onClick={closeNavBar} style={activeNav}>Login</NavLink></li>
              <li><NavLink to="signup" onClick={closeNavBar} style={activeNav}>Sign up</NavLink></li>
            </ul>
        </div>
    </div>
  )
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // toggle Navbar function
  const toggleBar = () => {
    setIsOpen(!isOpen)
  }
  return(
    <div>
      <section className='sm:hidden md:hidden'>
        <NavBar/>
      </section>
      <section className='sm:bg-white sm:p-4 sm:flex sm:flex-row sm:justify-between hidden '>
        <img src={Logo} alt="" className='sm:h-8 sm:w-12' />
        <button className='right-6 top-6 text-lg' onClick={toggleBar}>{isOpen ? <FaTimesCircle className='text-bold'/>:<FaBars className="text-bold"/>}</button>
      </section>
      {isOpen && <NavBar/>}
    </div>
  )
}

export default Navbar
