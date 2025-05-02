// Packages.jsx - Redesigned packages section
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGasPump, FaRocket, FaTruck } from 'react-icons/fa';

const Packages = () => {
  const navigate = useNavigate();

  const toLogin = () => {
    navigate('/login');
    window.scrollTo(0, 0);
  };

  const packages = [
    {
      title: "Easy Buy",
      description: "The easy buy package is for users buying below 25 litres. Products will be delivered within actual time.",
      icon: <FaGasPump size={32} />,
      delay: 0.1
    },
    {
      title: "Instant Delivery",
      description: "This package is for customers who wants their products delivered almost immediately. Some extra charges will be added.",
      icon: <FaRocket size={32} />,
      delay: 0.2
    },
    {
      title: "Bulk Delivery",
      description: "This is for users purchasing more than 25 litres of fuel.",
      icon: <FaTruck size={32} />,
      delay: 0.3
    }
  ];

  return (
    <div className="space-y-12">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-green-500 mb-6">Packages</h2>
        <p className="text-xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto">
          The packages below have been tailored for our daily needs in terms of budget, and emergencies.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {packages.map((pkg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: pkg.delay }}
            className="bg-green-700/70 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="p-8 text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-green-600">
                {pkg.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{pkg.title}</h3>
              <p className="text-gray-100 mb-8 min-h-20">{pkg.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toLogin}
                className="bg-white text-green-700 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                Purchase
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Packages;