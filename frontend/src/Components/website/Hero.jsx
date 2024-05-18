// This is the codebase for the Hero section
import React, { useState, useEffect } from 'react'
import Img from '../../assets/EcoFuel.gif';

const Hero = () => {

  return (
      <div className='sm:my-4 sm:h-full sm:px-8 justify-center w-full h-3/4 px-44 my-40 sm:background-altBlack'>
        <h1 className='sm:text-2xl font-bold text-4xl text-center'>Efficient fuel dispatching made simple:</h1>
        <p className='sm:text-lg my-4 text-2xl text-center'>Streamlining your operations with ease.</p>
        <img src={Img} alt=""className='sm:hidden h-32 w-32 my-24 mx-64' />
      </div>
  )
}

export default Hero;