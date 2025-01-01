import React, { useEffect } from 'react'
import  { Link, Outlet, useNavigate } from 'react-router-dom'
import AOS from 'aos';
import Logo from '../../../assets/Logo.png'
import { DashboardOutlined, UsergroupAddOutlined, DollarCircleOutlined, TeamOutlined } from '@ant-design/icons/lib/icons';


const Admin = () => {

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once - while scrolling down
    });

  }, []);  

  const navigate = useNavigate();

  const logOut = () => {
    return(
    navigate('/login')
  )}

  return (
    <div data-aos="fade-up" className='h-screen text-gray bg-my-image bg-cover flex flex-col'>
      <div className='p-4 bg-white'>
        <header className='flex flex-row justify-between'>
          <img src={Logo} alt="Fuel-up" className='h-8 w-12' />
          <button onClick={logOut} className='border outline-lime outline outline-offset-2 border-lime rounded bg-white text-sm p-1'>Sign Out</button>
        </header>
      </div>
      <div className='h-full text-gray flex flex-row'>
        <SideMenu/>
        <Outlet/>
      </div>
    </div>
  )
}

const SideMenu = () => {
  return(
    <div className='flex flex-col justify-evenly text-center text-2xl text-white w-64 bg-lime'>
      <div className='border-y-2 place-content-center h-full'>
        <Link to='/admin/dashboard'>
        <div className='flex place-content-center gap-4'>
        <span>Dashboard</span>
        <DashboardOutlined/>
        </div>
        </Link>
      </div>
      <div className='border-b-2 place-content-center h-full text-white'>
        <Link to='/admin/priceCtrl'>
        <div className='flex place-content-center gap-4'>
        <span>Price Control</span>
        <DollarCircleOutlined/>
        </div>
        </Link>
      </div>
      <div className='border-b-2 place-content-center h-full text-white'>
        <Link to='/admin/userList'>
        <div className='flex place-content-center gap-4'>
        <span>Users List</span>
        <UsergroupAddOutlined/>
        </div>
        </Link>
      </div>
      <div className='h-full place-content-center text-white'>
        <Link to='/admin/employee'>
        <div className='flex place-content-center gap-4'>
        <span>Employee</span>
        <TeamOutlined/>
        </div>
        </Link>
      </div>
    </div>
  )
}


export const UserList = () => {
  return(
    <div>
      Amount of users available
    </div>
  )
}

export const Employee = () => {
  return(
    <div>Add a staff</div>
  )
}

export default Admin
