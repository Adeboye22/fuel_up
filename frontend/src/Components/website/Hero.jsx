// This is the codebase for the Hero section
import React, { useState, useEffect } from 'react'
import Img from '../../assets/EcoFuel.gif';

const Hero = () => {
  const [text, setText] = useState('Initial Text');
  const texts = ['You don\'t have to compromise your comfort just to get fuel', '...you call, we deliver!', 'We offer the best prices per litre!', 'We deliver to various locations in lekki.']
  const [ index, setIndex ] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment the index and loop back to 0 if it extends the array length
      setIndex(prevIndex => (prevIndex + 1) % texts.length);
    }, 10000);  //Change text every 10 seconds

    // clean up the interval when the components unmounts
    return () => clearInterval(interval);
  }, []); //Run effect only once on a computer mount

  useEffect(() => {
    // Update the text when the index charges
    setText(texts[index]);
  }, [index, texts]);

  return (
      <div className='sm:my-2 sm:h-full sm:px-8 flex self-center w-full h-3/4 px-44 my-12'>
        <div className='sm:text-sm sm:h-1/2 sm:w-1/2 sm:bg-lime sm:p-4 sm:justify-center  bg-lime text-gray text-lg font-black h-3/4 w-1/2 px-8 py-24 text-center m-4'>
          <h1 className=''>{text}</h1>
        </div>
        <img src={Img} alt="" className='sm:h-1/2 sm:w-1/2 sm:my-8 h-3/4 w-1/2 -my-4' />
      </div>
  )
}

export default Hero;