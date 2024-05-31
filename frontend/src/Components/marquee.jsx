import React from 'react'

const Marquee = () => {
  return (
    <div className='overflow-hidden whitespace-nowrap  animate-marquee'>
      <p className='text-lg'>My scrolling text goes here. I will change it later</p>
    </div>
  );
};

export default Marquee;
