import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPlus, FaEllipsisH } from 'react-icons/fa';

const SavedLocations = ({ locations }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Saved Locations</h2>
        <button className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
          <FaPlus size={16} />
        </button>
      </div>
      
      <div className="space-y-4">
        {locations.map((location, index) => (
          <LocationItem key={index} location={location} />
        ))}
      </div>
      
      <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-white font-medium py-3 rounded-lg mt-6 transition-colors">
        Manage Locations
      </button>
    </motion.div>
  );
};

export default SavedLocations;

// Location Item Component - Light Mode
const LocationItem = ({ location }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 flex justify-between items-center border border-gray-100 dark:border-transparent">
      <div className="flex items-start">
        <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-lg mr-3 mt-1">
          <FaMapMarkerAlt className="text-emerald-600 dark:text-emerald-500" size={14} />
        </div>
        <span className="text-sm text-gray-700 dark:text-white">{location}</span>
      </div>
      <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
        <FaEllipsisH size={14} />
      </button>
    </div>
  );
};