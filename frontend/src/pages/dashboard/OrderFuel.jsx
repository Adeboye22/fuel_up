import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGasPump, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaInfoCircle, FaCreditCard } from 'react-icons/fa';
import { useTheme } from '@/components/theme-provider';

const OrderFuel = () => {
  const { theme } = useTheme();
  const isLightMode = theme === 'light';
  
  const [fuelType, setFuelType] = useState('petrol');
  const [quantity, setQuantity] = useState(20);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [step, setStep] = useState(1);
  
  // Mock data
  const locations = [
    { id: 1, name: 'Home', address: '15 Adeola Odeku St, Victoria Island' },
    { id: 2, name: 'Office', address: '24 Broad Street, Lagos Island' },
    { id: 3, name: 'Site', address: 'Plot 45, Lekki Phase 1' }
  ];
  
  const fuelPrices = {
    petrol: 790,
    diesel: 925,
    kerosene: 850
  };
  
  const paymentMethods = [
    { id: 'card1', type: 'card', last4: '4242', brand: 'Visa' },
    { id: 'card2', type: 'card', last4: '1234', brand: 'Mastercard' }
  ];
  
  const calculateTotal = () => {
    return fuelPrices[fuelType] * quantity;
  };
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process order submission
    alert('Order submitted successfully!');
    // Reset form or redirect
  };
  
  // Theme-specific styles
  const styles = {
    mainContainer: isLightMode
      ? "text-gray-800"
      : "text-white",
    cardContainer: isLightMode 
      ? "bg-white backdrop-blur-md border border-gray-300 shadow-lg" 
      : "bg-gray-800/40 backdrop-blur-md border border-gray-700/50 shadow-lg",
    progressBar: isLightMode
      ? "bg-gray-300"
      : "bg-gray-700",
    stepInactive: isLightMode
      ? "bg-gray-400 text-white"
      : "bg-gray-700 text-gray-300",
    stepText: isLightMode
      ? "text-gray-600"
      : "text-gray-400",
    cardSelected: isLightMode
      ? "border-emerald-500 bg-emerald-100"
      : "border-emerald-500 bg-emerald-600/20",
    cardUnselected: isLightMode
      ? "border-gray-300 bg-white hover:bg-gray-50"
      : "border-gray-700 bg-gray-800/50 hover:bg-gray-700/50",
    labelText: isLightMode
      ? "text-gray-700"
      : "text-gray-300",
    summaryBox: isLightMode
      ? "bg-gray-200/70"
      : "bg-gray-800/70",
    inputBg: isLightMode
      ? "bg-white border-gray-300 focus:border-emerald-500"
      : "bg-gray-800 border-gray-700 focus:border-emerald-500",
    buttonBack: isLightMode
      ? "border-gray-300 hover:bg-gray-200"
      : "border-gray-600 hover:bg-gray-700",
    subtleText: isLightMode
      ? "text-gray-600"
      : "text-gray-400",
    divider: isLightMode
      ? "border-gray-300"
      : "border-gray-700",
    iconBg: isLightMode
      ? "bg-emerald-500"
      : "bg-emerald-600",
    iconInactiveBg: isLightMode
      ? "bg-gray-300"
      : "bg-gray-700",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-8 ${styles.mainContainer}`}
    >
      <h1 className="text-2xl font-bold mb-6">Order Fuel</h1>
      
      <div className={`rounded-xl p-6 ${styles.cardContainer}`}>
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className={`absolute top-4 left-0 right-0 h-1 ${styles.progressBar} -z-10`}></div>
          
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center z-10">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step >= stepNumber ? styles.iconBg + ' text-white' : styles.stepInactive
                }`}
              >
                {stepNumber}
              </div>
              <span className={`text-xs mt-2 ${styles.stepText}`}>
                {stepNumber === 1 ? 'Select Fuel' : stepNumber === 2 ? 'Delivery Details' : 'Payment'}
              </span>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Fuel Type and Quantity */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Select Fuel Type & Quantity</h2>
              
              <div className="mb-6">
                <label className={`block mb-2 ${styles.labelText}`}>Fuel Type</label>
                <div className="grid grid-cols-3 gap-4">
                  {['petrol', 'diesel', 'kerosene'].map((type) => (
                    <div
                      key={type}
                      onClick={() => setFuelType(type)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        fuelType === type 
                          ? styles.cardSelected
                          : styles.cardUnselected
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <FaGasPump className="mr-2" />
                        <span className="capitalize font-medium">{type}</span>
                      </div>
                      <div className="text-lg font-bold text-emerald-600">₦{fuelPrices[type]}/L</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className={`block mb-2 ${styles.labelText}`}>Quantity (Liters)</label>
                <div className="flex items-center">
                  <button 
                    type="button"
                    onClick={() => quantity > 5 && setQuantity(quantity - 5)}
                    className={`${isLightMode ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'} py-2 px-4 rounded-l-lg`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(5, parseInt(e.target.value) || 5))}
                    className={`border-y ${isLightMode ? 'border-gray-300 bg-white' : 'border-gray-700 bg-gray-800'} py-2 px-4 text-center w-24`}
                    min="5"
                  />
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 5)}
                    className={`${isLightMode ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'} py-2 px-4 rounded-r-lg`}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className={`p-4 ${styles.summaryBox} rounded-lg mb-6`}>
                <div className="flex justify-between mb-2">
                  <span className={styles.subtleText}>Price per liter:</span>
                  <span>₦{fuelPrices[fuelType]}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className={styles.subtleText}>Quantity:</span>
                  <span>{quantity} liters</span>
                </div>
                <div className={`flex justify-between font-bold text-lg pt-2 border-t ${styles.divider}`}>
                  <span>Total:</span>
                  <span className="text-emerald-600">₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Step 2: Delivery Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
              
              <div className="mb-6">
                <label className={`block mb-2 ${styles.labelText}`}>Delivery Location</label>
                <div className="space-y-3">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      onClick={() => setSelectedLocation(location.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedLocation === location.id 
                          ? styles.cardSelected
                          : styles.cardUnselected
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${selectedLocation === location.id ? styles.iconBg : styles.iconInactiveBg}`}>
                          <FaMapMarkerAlt className={selectedLocation === location.id ? "text-white" : ""} />
                        </div>
                        <div>
                          <h3 className="font-medium">{location.name}</h3>
                          <p className={`text-sm ${styles.subtleText}`}>{location.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    className={`w-full py-3 border border-dashed ${
                      isLightMode 
                        ? "border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 hover:text-gray-700"
                        : "border-gray-600 text-gray-400 hover:bg-gray-800/50 hover:border-gray-500 hover:text-gray-300"
                    } rounded-lg transition-colors`}
                  >
                    + Add New Location
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block mb-2 ${styles.labelText}`}>Delivery Date</label>
                  <div className="relative">
                    <FaCalendarAlt className={`absolute left-3 top-3 ${isLightMode ? "text-gray-400" : "text-gray-500"}`} />
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className={`w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${styles.inputBg}`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block mb-2 ${styles.labelText}`}>Delivery Time</label>
                  <div className="relative">
                    <FaClock className={`absolute left-3 top-3 ${isLightMode ? "text-gray-400" : "text-gray-500"}`} />
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className={`w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none appearance-none focus:ring-1 focus:ring-emerald-500 ${styles.inputBg}`}
                    >
                      <option value="">Select time slot</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 4PM)</option>
                      <option value="evening">Evening (4PM - 8PM)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 ${styles.summaryBox} rounded-lg mb-6 flex items-start`}>
                <FaInfoCircle className="text-blue-500 mt-1 mr-3" />
                <p className={`text-sm ${isLightMode ? "text-gray-700" : "text-gray-300"}`}>
                  Delivery is available 7 days a week. Please note that there may be additional fees for express 
                  delivery (within 2 hours) or for deliveries outside standard hours (8AM-8PM).
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Payment */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              
              <div className="mb-6">
                <label className={`block mb-2 ${styles.labelText}`}>Select Payment Method</label>
                <div className="space-y-3 mb-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === method.id 
                          ? styles.cardSelected
                          : styles.cardUnselected
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${paymentMethod === method.id ? styles.iconBg : styles.iconInactiveBg}`}>
                          <FaCreditCard className={paymentMethod === method.id ? "text-white" : ""} />
                        </div>
                        <div>
                          <h3 className="font-medium">{method.brand}</h3>
                          <p className={`text-sm ${styles.subtleText}`}>**** **** **** {method.last4}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`p-4 ${styles.summaryBox} rounded-lg mb-6`}>
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className={styles.subtleText}>Fuel Type:</span>
                    <span className="capitalize">{fuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.subtleText}>Quantity:</span>
                    <span>{quantity} liters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.subtleText}>Price per liter:</span>
                    <span>₦{fuelPrices[fuelType]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.subtleText}>Delivery Fee:</span>
                    <span>₦500</span>
                  </div>
                </div>
                <div className={`flex justify-between font-bold text-lg pt-3 border-t ${styles.divider}`}>
                  <span>Total:</span>
                  <span className="text-emerald-600">₦{(calculateTotal() + 500).toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Navigation Buttons */}
          <div className={`flex justify-between pt-4 border-t ${styles.divider}`}>
            <button
              type="button"
              onClick={handleBack}
              className={`px-6 py-2 rounded-lg ${styles.buttonBack} transition-colors ${
                step === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={step === 1}
            >
              Back
            </button>
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Place Order
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default OrderFuel;