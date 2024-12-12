import React, { useEffect, useState } from 'react'
import  {Route, Routes} from 'react-router-dom'
import AOS from 'aos';
import 'aos/dist/aos.css';import {Menu} from 'antd';
import { HomeOutlined, CreditCardFilled, UserOutlined, PoweroffOutlined } from '@ant-design/icons/lib/icons'

const Admin = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);

  return (
    <div data-aos="fade-up" className='h-screen text-gray bg-my-image bg-cover flex flex-row  gap-8'>
      
      <Menu className='text-xl  bg-inherit bg-lime gap-8 flex flex-col'
      items={[
        { label: "Home", icon: <HomeOutlined/> },
        { label: "Price Control", icon: <CreditCardFilled/> },
        { label: "Employee", icon: <UserOutlined/> },
        { label: "Log Out", icon: <PoweroffOutlined/>, danger:true },
      ]}
      ></Menu>

      <Content/>
    </div>
  )
}

const Content = () => {
  return(
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/price_ctrl' element={<Price/>}/>
        <Route path='/employee' element={<Employee/>}/>
      </Routes>
    </div>
  )
}

const Home = () => {
  return(
    <div className='py-4 flex flex-col gap-8'>
      <div>Hi Ade</div>
      <div >
        <div className='border border-lime rounded-full text-center px-8 py-6'>4</div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

const Price = () => {
  return(
    <div>Price for petrol</div>
  )
}

const Employee = () => {
  return(
    <div>Add a staff</div>
  )
}

export default Admin
