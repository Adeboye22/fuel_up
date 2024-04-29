import React from 'react'

const Footbar = () => {
  return (
    <div className='sm:flex sm:flex-col sm:gap-4 sm:p-8 sm:text-base p-8 flex flex-row text-xl justify-between px-14  text-altBlack'>
        <div>
            <h3 className='font-black'>About</h3>
            <ul>
                <li>About Us</li>
                <li>Technology</li>
                <li>Contact Us</li>
            </ul>
        </div>
        <div>
            <h3 className=' font-black mb-2'>Services</h3>
            <ul>
                <li>Fuel Dispensing</li>
                <li>Payment Services</li>
                <li>Event Services</li>
                <li>Emergency Fuel delivery</li>
            </ul>
        </div>
        <div>
            <h3 className='font-black mb-2'>Locations</h3>
            <ul>
                <li>Lekki Phase 1</li>
                <li>Lekki Phase 2</li>
            </ul>
        </div>
        <div>
            <h3 className='font-black mb-2'>Legal</h3>
            <ul>
                <li>Privacy</li>
                <li>Terms</li>
                <li>Regulatory Environment</li>
            </ul>
        </div>
    </div>
  )
}

export default Footbar
