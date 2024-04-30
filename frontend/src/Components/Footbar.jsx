import React from 'react'

const Footbar = () => {
  return (
    <div className='sm:flex sm:flex-col sm:gap-4 sm:p-8 sm:text-lg p-8 flex flex-row text-xl justify-between px-14  text-altBlack'>
        <div>
            <h3 className='font-black'>About</h3>
            <ul>
                <a href="#about"><li>About Us</li></a>
                <li>Contact Us</li>
            </ul>
        </div>
        <div>
            <h3 className=' font-black mb-2'>Services</h3>
            <ul>
                <a href="#fuel_dispensing"><li>Fuel Dispensing</li></a>
                <a href="#availability"><li>24/7 Availability</li></a>
                <a href="#accessibility"><li>Convenience & Accessibility</li></a>
                <a href="#bulk_delivery"><li>Bulk Fuel Delivery</li></a>
                <a href="#quality_assurance"><li>Quality Assurance</li></a>
                <a href="#customer_care"><li>Customer Care</li></a>
            </ul>
        </div>
        <div>
            <h3 className='font-black mb-2'>Locations</h3>
            <ul>
                <a href="#locations"><li>Lekki Phase 1</li></a>
                <a href="#locations"><li>Lekki Phase 2</li></a>
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
