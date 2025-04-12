import React from 'react';
import { motion } from 'framer-motion';
import { FaGasPump, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
    >
      <ActionCard 
        title="Order Fuel" 
        description="Quick fuel delivery" 
        icon={<FaGasPump size={24} />} 
        primary 
        onClick={() => navigate('order-fuel')}
      />
      
      <ActionCard 
        title="Track Order" 
        description="Check delivery status" 
        icon={<FaTruck size={24} />} 
      />
      
      <ActionCard 
        title="Add Location" 
        description="Save delivery address" 
        icon={<FaMapMarkerAlt size={24} />} 
      />
    </motion.div>
  );
};

export default QuickActions;

// Action Card Component
const ActionCard = ({ title, description, icon, primary = false, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`${primary ? 'bg-emerald-600' : 'bg-white dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700/50'} rounded-xl p-6 shadow-md flex items-center justify-between cursor-pointer`}
    >
      <div>
        <h3 className={`text-lg font-semibold mb-1 ${primary ? 'text-white' : 'text-gray-800 dark:text-white'}`}>{title}</h3>
        <p className={`${primary ? 'text-emerald-100' : 'text-gray-500 dark:text-gray-400'} text-sm`}>{description}</p>
      </div>
      <div className={`${primary ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded-lg`}>
        {icon}
      </div>
    </motion.div>
  );
};