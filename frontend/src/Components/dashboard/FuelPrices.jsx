import React from 'react';
import { motion } from 'framer-motion';
import { FaGasPump, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const FuelPrices = ({ prices }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Current Fuel Prices</h2>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded-md text-gray-300">Updated: Today</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FuelPriceCard 
          type="Petrol (PMS)" 
          price={prices.petrol} 
          // change={{ value: 2.1, increase: true }} 
          color="red" 
        />
        
        <FuelPriceCard 
          type="Diesel (AGO)" 
          price={prices.diesel} 
          // change={{ value: 0.5, increase: false }} 
          color="yellow" 
        />
        
        <FuelPriceCard 
          type="Kerosene (DPK)" 
          price={prices.kerosene} 
          // change={{ value: 1.2, increase: true }} 
          color="blue" 
        />
      </div>
    </motion.div>
  );
};

export default FuelPrices;

// 11. Fuel Price Card Component
const FuelPriceCard = ({ type, price, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className={`bg-${color}-100 dark:bg-${color}-500/20 p-2 rounded-lg mr-3`}>
            <FaGasPump className={`text-${color}-500`} />
          </div>
          <span className="font-medium text-gray-800 dark:text-white">{type}</span>
        </div>
        {/* <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          {change.increase ? (
            <FaArrowUp className="text-red-500 dark:text-red-400 mr-1" />
          ) : (
            <FaArrowDown className="text-green-500 dark:text-green-400 mr-1" />
          )}
          <span>{change.value}%</span>
        </div> */}
      </div>
      <div className="text-2xl font-bold text-gray-800 dark:text-white">₦{price}<span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/liter</span></div>
    </div>
  );
};
