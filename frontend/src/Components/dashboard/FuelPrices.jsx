import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGasPump } from 'react-icons/fa';
import apiService from '@/lib/api';

const FuelPrices = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.get('/products');
        
        if (response.status === 'success') {
          setProducts(response.data);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to get color based on product name
  const getProductColor = (name) => {
    const nameLC = name.toLowerCase();
    if (nameLC.includes('petrol')) return 'red';
    if (nameLC.includes('diesel')) return 'yellow';
    if (nameLC.includes('kerosene')) return 'blue';
    return 'gray'; // default color
  };

  // Function to format price from kobo to naira
  const formatPrice = (priceInKobo) => {
    return priceInKobo / 100;
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Current Fuel Prices</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Current Fuel Prices</h2>
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 p-4 rounded-lg text-red-700 dark:text-red-400">
          {error}. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Current Fuel Prices</h2>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded-md text-gray-300">
          Updated: {new Date().toLocaleDateString()}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <FuelPriceCard 
              key={product._id}
              type={product.name} 
              price={formatPrice(product.unitPrice)} 
              color={getProductColor(product.name)} 
              unit={product.unitOfMeasure}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            No fuel prices available at the moment.
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Fuel Price Card Component
const FuelPriceCard = ({ type, price, color, unit }) => {
  return (
    <div className="bg-white dark:bg-gray-800/60 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className={`bg-${color}-100 dark:bg-${color}-500/20 p-2 rounded-lg mr-3`}>
            <FaGasPump className={`text-${color}-500`} />
          </div>
          <span className="font-medium text-gray-800 dark:text-white">{type}</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-800 dark:text-white">
        ₦{price.toLocaleString()}<span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/{unit}</span>
      </div>
    </div>
  );
};

export default FuelPrices;