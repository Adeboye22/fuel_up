// This the codebase for services. Note that it has fragments of reusable codes in the services folder.
import React from 'react'
import Nozzles from '../../assets/Nozzles.jpg'
import Availability from '../../assets/247Availability.jpg'
import { motion } from 'framer-motion'

const Services = () => {
  return (
    <div className='text-altBlack'>
      <div className='sm:p-4 flex flex-col gap-4 bg-lime border rounded py-4 px-8'>
      <h1 className='sm:text-xl text-3xl text-altBlack'><strong>Services</strong></h1>
        {/* --fuel dispensing-- */}
        <section id='fuel_dispensing' className='sm:flex-col sm:gap-0 flex flex-row w-full gap-4'>
          <motion.div className='sm:p-8 self-center bg-altBlack text-white p-16 my-12'
          initial={{opacity:0}}
          animate={{opacity:100}}
          transition={{
            duration:0.5,
            delay:0.3
          }}
          whileHover={{
            scale:1.1,
          }}>
            <h2 className='sm:text-lg text-2xl pb-1'>Fuel Dispensing:</h2>
            <span className='sm:text-base text-xl'>Whether you need gasoline, diesel, or alternative fuels, we offer a wide range of fuel types to keep your vehicles, equipment, and machinery running smoothly.</span>
          </motion.div>
          <motion.div className='sm:w-full w-3/4 flex flex-row place-content-center'
          initial={{opacity:0}}
          animate={{opacity:100}}
          transition={{
            duration:0.5,
            delay:0.3
          }}
          whileHover={{
            scale:1.1,
          }}>
            <img src={Nozzles} alt="" className='sm:hidden border rounded border-0 shadow-lg shadow-altBlack w-72 h-60 mt-12'/>
          </motion.div>
        </section>

        {/* --24/7 Availability-- */}
        <section id='availability' className='sm:flex-col sm:gap-0 flex flex-row w-full gap-4'>
          <motion.div className='sm:w-full w-3/4 flex flex-row place-content-center'
            initial={{opacity:0}}
            animate={{opacity:100}}
            transition={{
              duration:0.5,
              delay:0.3
            }}
            whileHover={{
              scale:1.1,
            }}>
            <img src={Availability} alt="" className='sm:hidden border rounded border-0 shadow-lg shadow-altBlack w-72 h-60 mt-12'/>
          </motion.div>
          <motion.div className='sm:p-8 self-center bg-altBlack text-white p-16 my-12'
          initial={{opacity:0}}
          animate={{opacity:100}}
          transition={{
            duration:0.5,
            delay:0.3
          }}
          whileHover={{
            scale:1.1,
          }}>
              <h2 className='sm:text-lg text-2xl pb-1'>24/7 Availabilty:</h2>
              <span className='sm:text-base text-xl'>We understand that fuel needs can arise at any time, which is why our fuel dispensing services are available 24 hours a day, 7 days a week. No matter the hour or location, we're here to serve you.</span>
          </motion.div>
        </section>

        {/* --convenience and accessibility-- */}
        <section id='accessibility' className='sm:flex-col sm:gap-0 flex flex-row w-full gap-4'>
          <motion.div className='sm:p-4 self-center bg-altBlack text-white p-16 my-12'
          initial={{opacity:0}}
          animate={{opacity:100}}
          transition={{
            duration:0.5,
            delay:0.3
          }}
          whileHover={{
            scale:1.1,
          }}>
              <h2 className='sm:text-lg text-2xl pb-1'>Convenience and Accessibilty:</h2>
              <span className='sm:text-base text-xl'>With strategically located fuel stations and mobile dispensing options, we provide convenient access to fuel whenever and wherever you need it.</span>
          </motion.div>
          <motion.div className='sm:w-full w-3/4 flex flex-row place-content-center'
          initial={{opacity:0}}
          animate={{opacity:100}}
          transition={{
            duration:0.5,
            delay:0.3
          }}
          whileHover={{
            scale:1.1,
          }}>
            <img src="https://media.istockphoto.com/id/1368573426/photo/mature-african-man-talking-on-cellphone-using-laptop-in-office.jpg?s=612x612&w=0&k=20&c=uh4TcBEIPxm6NyY4gYD9X-MA89iJsVOIov5KReJzExo=" alt="" className='sm:hidden border rounded border-0 shadow-lg shadow-altBlack w-72 h-60 mt-12'/>
          </motion.div>
        </section>

        {/* --bulk fuel delivery */}
        <section id='bulk_delivery' className='sm:flex-col sm:gap-0 flex flex-row w-full gap-4'>
          <motion.div className='sm:w-full w-3/4 flex flex-row place-content-center'
          initial={{opacity:0}}
          animate={{opacity:100}}
          transition={{
            duration:0.5,
            delay:0.3
          }}
          whileHover={{
            scale:1.1,
          }}>
            <img src="https://www.fuel.crs/wcm/connect/www.fuel.crs1162/33b88f2f-8c7d-414b-a765-3a446b23613e/Bulk+Delivery+Hero.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_2IKA1G82MOM2F0QOF0CTUF1270-33b88f2f-8c7d-414b-a765-3a446b23613e-oVtzKDz5" alt="" className='sm:hidden border rounded border-0 shadow-lg shadow-altBlack w-72 h-60 mt-12'/>
          </motion.div>
          <motion.div className='sm:p-4 self-center bg-altBlack text-white p-16 my-12'
          initial={{opacity:0}}
          animate={{opacity:100}}
          transition={{
            duration:0.5,
            delay:0.3
          }}
          whileHover={{
            scale:1.1,
          }}>
            <h2 className='sm:text-lg text-2xl pb-1'>Bulk Fuel Delivery:</h2>
            <span className='sm:text-base text-xl'>For businesses and organizations with high-volume fuel requirements, we offer bulk fuel delivery services to keep your operations running efficiently.</span>
          </motion.div>
        </section>

        {/* --quality assurance-- */}
        <section id='quality_assurance' className='sm:flex-col sm:gap-0 flex flex-row w-full gap-4'>
          <motion.div className='sm:p-4 self-center bg-altBlack text-white p-16 my-8'
          initial={{opacity:0}}
          animate={{opacity:100}}
          transition={{
            duration:0.5,
            delay:0.3
          }}
          whileHover={{
            scale:1.1,
          }}>
            <h2 className='sm:text-lg text-2xl pb-1'>Quality Assurance:</h2>
            <span className='sm:text-base text-xl'>Our fuels are sourced from reputable suppliers and undergo rigorous quality control measures to ensure they meet the highest industry standards. You can trust that the fuel you receive from us is clean, safe, and reliable.</span>
          </motion.div>
          <motion.div className='sm:w-full w-3/4 flex flex-row place-content-center'
          initial={{opacity:0}}
          animate={{opacity:100}}
          transition={{
            duration:0.5,
            delay:0.3
          }}
          whileHover={{
            scale:1.1,
          }}>
            <img src="https://st2.depositphotos.com/4012355/8044/i/450/depositphotos_80447722-stock-photo-best-quality-concept.jpg" alt="" className='sm:hidden border rounded border-0 shadow-lg shadow-altBlack w-72 h-60 mt-12'/>
          </motion.div>
        </section>

        {/* --customercare-- */}
        <section id='customer_care' className='sm:flex-col sm:gap-0 flex flex-row w-full gap-4'>
          <motion.div className='sm:w-full w-3/4 flex flex-row place-content-center'
          initial={{opacity:0}}
          animate={{opacity:100}}
          transition={{
            duration:0.5,
            delay:0.3
          }}
          whileHover={{
            scale:1.1,
          }}>
            <img src="https://media.istockphoto.com/id/1437821111/photo/customer-service-happy-and-communication-of-woman-at-call-center-pc-talking-with-joyful-smile.webp?b=1&s=170667a&w=0&k=20&c=VaNC1beA8yRqc22HZdOnyyl8KrHNNXNmOoZ5T_xr6HY=" alt="" className='sm:hidden border rounded border-0 shadow-lg shadow-altBlack w-72 h-60 mt-12'/>
          </motion.div>
          <motion.div className='sm:p-4 self-center bg-altBlack text-white p-16 my-12'
          initial={{opacity:0}}
          animate={{opacity:100}}
          transition={{
            duration:0.5,
            delay:0.3
          }}
          whileHover={{
            scale:1.1,
          }}>
            <h2 className='sm:text-lg text-2xl pb-1'>Customer Care:</h2>
            <span className='sm:text-base text-xl'>Our team of experienced professionals is here to assist you with any fuel-related inquiries, technical support, or emergency assistance you may need. Your satisfaction and safety are our top priorities.</span>
          </motion.div>
        </section>

      </div>
    </div>
  )
}

export default Services
