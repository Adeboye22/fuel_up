import React from 'react'
import {} from 'react-icons/fa'
import FD from '../../assets/Refuel.gif'
import Clock from '../../assets/Clock.gif'
import Access from '../../assets/Smartphone.gif'
import Bulk from '../../assets/Pallete.gif'
import QA from '../../assets/QualityAssurance.gif'
import CS from '../../assets/CustomerSupport.gif'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'


const OurService = () => {
  const navigate = useNavigate();

  const Services = () => {
    navigate('/services')
  }
  return (
    <div className='flex flex-col gap-4'>
        <div className='flex flex-row gap-2 self-center'>

            {/* --fuel dispensing-- */}
              <motion.div className='sm:h-20 sm:w-20 bg-white h-28 w-28  p-2 flex flex-col overflow-hidden hover:border hover:rounded'
              initial={{opacity:0}}
              animate={{opacity:100}}
              transition={{
                duration:0.5,
                delay:0.3
              }}
              whileHover={{
                scale:1.2,
              }} onClick={Services}>
                  <img src={FD} alt="" className='sm:h-8 sm:w-8 h-16 w-16 self-center'/>
                  <span className='sm:text-center text-altBlack text-xs self-center font-medium'>Fuel Dispensing</span>
              </motion.div>

            {/* --24/7 Availability-- */}
              <motion.div className='sm:h-20 sm:w-20 bg-white h-28 w-28  p-2 flex flex-col overflow-hidden hover:border hover:rounded'
              initial={{opacity:0}}
              animate={{opacity:100}}
              transition={{
                duration:0.5,
                delay:0.3
              }}
              whileHover={{
                scale:1.2,
              }} onClick={Services}>
                <img src={Clock} alt="" className='sm:h-8 sm:w-8 h-16 w-16 self-center'/>
                <span className='sm:text-center text-altBlack text-xs self-center font-medium'>24/7 Availability</span>           
              </motion.div>

            {/* --convenience and accessibility-- */}
              <motion.div className='sm:h-20 sm:w-20 bg-white h-28 w-28  p-2 flex flex-col overflow-hidden hover:border hover:rounded'
              initial={{opacity:0}}
              animate={{opacity:100}}
              transition={{
                duration:0.5,
                delay:0.3
              }}
              whileHover={{
                scale:1.2,
              }} onClick={Services}>
                <img src={Access} alt="" className='sm:h-8 sm:w-8 h-16 w-16  self-center'/>
                <span className='sm:pt-4 text-altBlack text-xs self-center font-medium'>Accesibility</span>
              </motion.div>

        </div>
        <div className='flex flex-row gap-2 self-center'>

          {/* --bulk fuel delivery-- */}
            <motion.div className='sm:h-20 sm:w-20 bg-white h-28 w-28 p-2 flex flex-col overflow-hidden hover:border hover:rounded'
            initial={{opacity:0}}
            animate={{opacity:100}}
            transition={{
              duration:0.5,
              delay:0.3
            }}
            whileHover={{
              scale:1.2,
            }} onClick={Services}>
                <img src={Bulk} alt="" className='sm:h-8 sm:w-8 h-16 w-16  self-center'/>
                <span className='sm:pt-2 text-altBlack text-xs self-center font-medium text-center'>Bulk Fuel Delivery</span>
            </motion.div>

          {/* --quality assurance-- */}
            <motion.div className='sm:h-20 sm:w-20 bg-white h-28 w-28 p-2 flex flex-col overflow-hidden hover:border hover:rounded text-center'
            initial={{opacity:0}}
            animate={{opacity:100}}
            transition={{
              duration:0.5,
              delay:0.3
            }}
            whileHover={{
              scale:1.2,
            }} onClick={Services}>
              <img src={QA} alt="" className='sm:h-8 sm:w-8 h-16 w-16  self-center'/>
              <span className='sm:pt-2 text-altBlack text-xs self-center font-medium text-center'>Quality Assurance</span>               
            </motion.div>

          {/* --customer support-- */}
            <motion.div className='sm:h-20 sm:w-20 bg-white h-28 w-28  p-2 flex flex-col overflow-hidden hover:border hover:rounded text-center'
            initial={{opacity:0}}
            animate={{opacity:100}}
            transition={{
              duration:0.5,
              delay:0.3
            }}
            whileHover={{
              scale:1.2,
            }} onClick={Services}>
              <img src={CS} alt="" className='sm:h-8 sm:w-8 h-16 w-16 self-center'/>
              <span className='sm:pt-2 text-altBlack text-xs self-center font-medium'>Customer Support</span> 
            </motion.div>
        </div>
    </div>
  )
}

export default OurService
