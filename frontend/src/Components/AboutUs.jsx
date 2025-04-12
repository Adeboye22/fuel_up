import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './theme-provider';

const AboutUs = () => {
  const {theme} = useTheme();
  const benefits = [
    {
      icon: "⏱️",
      title: "Convenience and Time Savings",
      description: "Skip the hassle of waiting in line at gas stations. Fuel Up brings the fuel directly to your location, saving valuable time and effort."
    },
    {
      icon: "💰",
      title: "Cost Savings",
      description: "Fuel Up is budget friendly as we care for our users. You don't have to break a bank."
    },
    {
      icon: "📈",
      title: "Improved Efficiency",
      description: "Businesses can streamline their operations by outsourcing fuel management. This frees up employee time and optimize their fuel consumption."
    },
    {
      icon: "🛡️",
      title: "Safety and Reliability",
      description: "Our trained professionals handle the transportation and delivery of fuel, ensuring safety and compliance with regulations."
    }
  ];

  return (
    <div className="">
      {/* Top Section with Overlapping Elements */}
      <div className="relative max-w-7xl mx-auto px-4 mb-32">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute left-1/4 top-0 w-64 h-64 bg-green-500/10 dark:bg-green-500/5 rounded-full mix-blend-multiply dark:mix-blend-overlay blur-3xl"></div>
          <div className="absolute right-1/4 top-1/3 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full mix-blend-multiply dark:mix-blend-overlay blur-3xl"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="flex flex-col md:flex-row items-center gap-16">
            {/* Left Side: About Text */}
            <div className="md:w-1/2 z-10">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-5xl font-bold mb-6 inline-block"
              >
                <span className="text-emerald-500">
                  About Us
                </span>
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-xl text-gray-800 dark:text-gray-200 mb-8 leading-relaxed">
                  We are Nigeria's first fuel dispatch service. FuelUp is a reliable door-step fuel delivery service. 
                  We offer ease, comfort, and emergency fuel delivery for unexpected situations.
                </p>
                
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-full bg-green-500/20 dark:bg-green-500/10 flex items-center justify-center">
                    <span className="text-green-400 text-2xl">01</span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">Nigeria's first fuel dispatch service</p>
                </div>
                
                <div className="mt-6 mb-8 w-full h-px bg-gradient-to-r from-green-500/50 via-blue-500/50 to-transparent dark:from-green-500/30 dark:via-blue-500/30"></div>
                
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-full bg-blue-500/20 dark:bg-blue-500/10 flex items-center justify-center">
                    <span className="text-blue-400 text-2xl">02</span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">Reliable door-step fuel delivery</p>
                </div>
              </motion.div>

              {/* Why Fuel Up Section - Horizontal Layout */}
              <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative overflow-hidden mt-24"
                >
                  <div className="flex flex-col">
                    <div>
                      <h2 className="text-4xl font-bold text-emerald-500 mb-6">
                        Why Fuel Up?
                      </h2>
                      <div className="w-16 h-1 bg-green-400 rounded-full mb-6"></div>
                    </div>
                    
                    <div className="shadow hover:shadow-xl transition-all duration-500 transform cursor-pointer backdrop-blur-sm md:col-span-2 p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                      <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                        FuelUp delivers fuel to your doorstep, anytime, anywhere. We provide comfort and keep power from going out. 
                        You can order online, schedule delivery, and power your home or business. We help keep big businesses 
                        (like schools, hotels, fancy restaurants, supermarkets, retail stores, etc) running through our bulk fuel delivery service.
                      </p>
                    </div>
                  </div>
                </motion.div>
            </div>
            
            {/* Right Side: App Image in 3D Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:w-1/2 relative"
            >
              <div className="relative w-full max-w-sm mx-auto perspective-1000">
                <div className="relative transform-style-3d rotate-y-12 group">
                  {/* Phone frame */}
                  <div className="relative bg-gray-900 rounded-[2rem] p-2 overflow-hidden shadow-2xl">
                    {/* Phone screen */}
                    <div className="overflow-hidden rounded-[1.7rem]">
                      {theme === "light" ? <img 
                        src="/src/assets/fuelup-dashboard.png" 
                        alt="FuelUp App" 
                        className="w-full h-full object-contain"
                      /> : <img 
                      src="/src/assets/fuelup-dashboard-dark.png" 
                      alt="FuelUp App" 
                      className="w-full h-full object-contain"
                    />}
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-10 -right-8 bg-gray-800 dark:bg-gray-700 rounded-lg p-3 shadow-xl transform rotate-6 z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                        🔥
                      </div>
                      <p className="text-white text-sm">Fast Delivery</p>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-8 -left-4 bg-gray-800 dark:bg-gray-700 rounded-lg p-3 shadow-xl transform -rotate-3 z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        ⛽
                      </div>
                      <p className="text-white text-sm">Premium Fuel</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Benefits Section - Horizontal Cards */}
      <div className="px-4 mb-20 bg-gray-100 dark:bg-gray-900 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-green-500 mb-6">
            Benefits
          </h2>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto">
            Fuel Up offers a range of benefits to both businesses and individual consumers.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto ">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 shadow rounded-2xl p-8 hover:translate-y-[-6px] transition-all duration-300 group"
            >
              <div className="mb-6 text-4xl">{benefit.icon}</div>
              <h3 className="text-xl text-gray-800 dark:text-gray-100 font-bold mb-4 group-hover:text-green-400 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Disclaimer - Minimal Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 border-l-4 border-red-500 rounded-r-xl p-8">
          <div className="flex items-start space-x-4">
            <div className="min-w-max pt-1">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-red-500 text-lg font-bold mb-2">Disclaimer Notice:</h3>
              <p className="text-gray-50">
                We do not sell fuel (We are not fuel marketers). We only dispatch fuel based on our clients' orders from the nearest filling station.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;