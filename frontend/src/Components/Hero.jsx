import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="max-w-5xl mx-auto text-white text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
        <span className="inline-block bg-yellow-400/20 text-white font-medium text-sm px-4 py-1 rounded-full">
          Nigeria's First Fuel Dispatch Service
        </span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-6xl font-bold leading-tight mb-6"
      >
        Efficient Fuel Delivery
        <span className="block">at Your <span className="text-yellow-400">Doorstep</span></span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
      >
        No more queues, no more waiting. We bring the fuel to you, 
        <span className="text-emerald-400 font-semibold"> anytime, anywhere</span>.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-center w-72 lg:w-full lg:max-w-xl"
      >
        <div
          // whileHover={{ scale: 1.05 }}
          // whileTap={{ scale: 0.95 }}
          className="px-8 py-4 w-full bg-emerald-600 text-white font-bold rounded-full shadow-lg hover:bg-emerald-500 transition-colors duration-300 flex items-center justify-center"
        >
          <Link to="/signup">Get Started</Link>
          <FaArrowRight className="ml-2" />
        </div>
        <div
          // whileHover={{ scale: 1.05 }}
          // whileTap={{ scale: 0.95 }}
          className="px-8 py-4 w-full bg-transparent text-white border-2 border-white font-bold rounded-full hover:bg-white/10 transition-colors duration-300"
        >
          <Link to="/signin">Log In</Link>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-16 flex justify-center"
      >
        <div className="flex flex-wrap items-center justify-center gap-6 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-emerald-500 rounded-full h-3 w-3 mr-2"></div>
            <span className="text-sm">24/7 Service</span>
          </div>
          <div className="flex items-center">
            <div className="bg-emerald-500 rounded-full h-3 w-3 mr-2"></div>
            <span className="text-sm">Fast Delivery</span>
          </div>
          <div className="flex items-center">
            <div className="bg-emerald-500 rounded-full h-3 w-3 mr-2"></div>
            <span className="text-sm">Secure Payments</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
