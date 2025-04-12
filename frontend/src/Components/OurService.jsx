import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGasPump, FaClock, FaMobile, FaTruck, FaCheckCircle, FaHeadset } from 'react-icons/fa';

const OurService = () => {
  const navigate = useNavigate();

  const handleServiceClick = () => {
    navigate('/services');
  };

  const services = [
    {
      icon: <FaGasPump size={24} />,
      title: "Fuel Dispensing",
      description: "Premium quality fuel delivered directly to your location",
      delay: 0.1
    },
    {
      icon: <FaClock size={24} />,
      title: "24/7 Availability",
      description: "Round-the-clock service for all your fuel needs",
      delay: 0.2
    },
    {
      icon: <FaMobile size={24} />,
      title: "Mobile Accessibility",
      description: "Order fuel with our easy-to-use mobile application",
      delay: 0.3
    },
    {
      icon: <FaTruck size={24} />,
      title: "Bulk Delivery",
      description: "Large volume deliveries for businesses and organizations",
      delay: 0.4
    },
    {
      icon: <FaCheckCircle size={24} />,
      title: "Quality Assurance",
      description: "Guaranteed high-quality fuel that meets all standards",
      delay: 0.5
    },
    {
      icon: <FaHeadset size={24} />,
      title: "Customer Support",
      description: "Dedicated support team available to assist you",
      delay: 0.6
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden">
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">Our Premium <span className='text-yellow-500'>Features</span></h2>
          <div className="h-1 w-16 bg-emerald-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">Experience unparalleled fuel delivery services tailored to meet your specific needs with efficiency and reliability.</p>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="relative group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: service.delay }}
            onClick={handleServiceClick}
          >
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-3xl shadow hover:shadow-xl transition-all duration-500 h-full transform group-hover:-translate-y-2 cursor-pointer backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500 opacity-0 group-hover:opacity-5 rounded-full blur-xl transition-all duration-500"></div>
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 group-hover:shadow-emerald-200 dark:group-hover:shadow-emerald-900 group-hover:shadow-lg">
                {service.icon}
              </div>
              
              <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
              
              <div className="mt-6 pt-4 transition-opacity duration-300 border-t border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                  Learn more 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurService;