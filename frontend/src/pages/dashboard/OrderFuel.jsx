import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGasPump, FaMapMarkerAlt, FaInfoCircle, FaCreditCard } from 'react-icons/fa';
import { useTheme } from '@/components/theme-provider';
import useAuthStore from '@/stores/useAuthStore';
import useOrderStore from '@/stores/useOrderStore';
import { toast } from 'react-hot-toast';
import apiService from '@/lib/api';

const OrderFuel = () => {
  const { theme } = useTheme();
  const isLightMode = theme === 'light';
  
  // Auth store
  const { user, authenticated } = useAuthStore();
  
  // Order store
  const { createOrder, loading, error } = useOrderStore();
  
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(20);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  
  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Get user's addresses when component mounts
  useEffect(() => {
    if (user?.addresses?.length > 0) {
      // Pre-select default address if available
      const defaultAddress = user.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedLocation(defaultAddress._id);
      } else {
        setSelectedLocation(user.addresses[0]._id);
      }
    }
  }, [user]);
  
  // Fetch all available products
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await apiService.get('/products');
      if (response.status === 'success') {
        setProducts(response.data);
        // Pre-select the first product if available
        if (response.data.length > 0) {
          setSelectedProduct(response.data[0]);
        }
      } else {
        toast.error('Failed to fetch fuel products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch fuel products');
    } finally {
      setProductsLoading(false);
    }
  };
  
  const paymentMethods = [
    { id: 'card1', type: 'card', last4: '4242', brand: 'Visa' },
    { id: 'card2', type: 'card', last4: '1234', brand: 'Mastercard' }
  ];
  
  // Calculate fuel cost (in kobo)
  const calculateFuelCost = () => {
    return selectedProduct?.unitPrice * quantity || 0;
  };

  // Calculate delivery fee (in kobo)
  const calculateDeliveryFee = () => {
    return 50000; // 500 NGN
  };
  
  // Calculate total order amount (in kobo)
  const calculateTotal = () => {
    return calculateFuelCost() + calculateDeliveryFee();
  };

  // Format price for display (convert kobo to NGN)
  const formatPrice = (amount) => {
    return (amount / 100).toLocaleString();
  };
  
  const handleNext = () => {
    // Validate current step before proceeding
    if (validateCurrentStep()) {
      setStep(step + 1);
      // Clear any previous errors
      setFormErrors({});
    }
  };
  
  const handleBack = () => {
    setStep(step - 1);
    // Clear any previous errors
    setFormErrors({});
  };
  
  // Validate form inputs for current step
  const validateCurrentStep = () => {
    const errors = {};
    
    if (step === 1) {
      if (!selectedProduct) {
        errors.product = 'Please select a fuel type';
      }
      if (!quantity || quantity < 5) {
        errors.quantity = 'Minimum quantity is 5 liters';
      }
    } else if (step === 2) {
      if (!selectedLocation) {
        errors.location = 'Please select a delivery location';
      }
    } else if (step === 3) {
      if (!paymentMethod) {
        errors.payment = 'Please select a payment method';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle payment initiation
  const initiatePaystackPayment = async (orderId) => {
    try {
      // Use apiService instead of axios directly for consistency
      const response = await apiService.post('/payment/initiation', {
        orderId,
        // gateway: 'paystack'
      });

      console.log(response.link);

      // Check if payment link is available
      if (!response?.link) {
        toast.error('Payment link not available');
        return null;
      }
      
      // Redirect to Paystack checkout page
      window.location.href = response.link;
      
      return response;
    } catch (err) {
      console.error('Payment initiation error:', err);
      const errorMessage = err.response?.message || 'Failed to initialize payment. Please try again.';
      toast.error(errorMessage);
      throw err;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!validateCurrentStep()) {
      return;
    }
    
    try {
      setPaymentProcessing(true);
      
      // Find selected address details
      const selectedAddressObj = user?.addresses?.find(addr => addr._id === selectedLocation);
      const addressString = selectedAddressObj ? 
        `${selectedAddressObj.address}, ${selectedAddressObj.city}, ${selectedAddressObj.state}` : '';
      
      // Create order data with necessary fields
      // Note: Using "qunatity" instead of "quantity" to match API's expected structure
      const orderData = {
        orderItems: [
          {
            productId: selectedProduct._id,
            qunatity: quantity  // Using the API's expected field name
          }
        ],
        orderAddress: addressString
      };
      
      // Submit the order
      const orderResponse = await createOrder(orderData);
      
      if (!orderResponse?.data?._id) {
        throw new Error('Order creation failed. No order ID returned.');
      }
      
      // Show success message for order creation
      toast.success("Order created successfully!");
      
      // Initiate payment with Paystack
      await initiatePaystackPayment(orderResponse.data._id);
      
    } catch (err) {
      // Show detailed error message
      const errorMessage = error || err.message || "Failed to create order. Please try again.";
      toast.error(errorMessage);
      
      // Log error for debugging
      console.error('Order submission error:', err);
    } finally {
      setPaymentProcessing(false);
    }
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
    errorText: "text-red-500 text-sm mt-1"
  };
  
  // Display error message for a field
  const ErrorMessage = ({ name }) => {
    return formErrors[name] ? (
      <p className={styles.errorText}>{formErrors[name]}</p>
    ) : null;
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
                {stepNumber === 1 ? 'Select Fuel' : stepNumber === 2 ? 'Delivery Location' : 'Payment'}
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
              
              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className={`block mb-2 ${styles.labelText}`}>Fuel Type</label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => setSelectedProduct(product)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedProduct?._id === product._id 
                              ? styles.cardSelected
                              : styles.cardUnselected
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <FaGasPump className="mr-2" />
                            <span className="capitalize font-medium">{product.name}</span>
                          </div>
                          <div className="text-lg font-bold text-emerald-600">₦{formatPrice(product.unitPrice)}/{product.unitOfMeasure}</div>
                        </div>
                      ))}
                    </div>
                    <ErrorMessage name="product" />
                  </div>
                  
                  <div className="mb-6">
                    <label className={`block mb-2 ${styles.labelText}`}>Quantity ({selectedProduct?.unitOfMeasure || 'liters'})</label>
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
                        className={`border-y outline-none ${isLightMode ? 'border-gray-300 bg-white' : 'border-gray-700 bg-gray-800'} py-2 px-4 text-center w-24`}
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
                    <ErrorMessage name="quantity" />
                  </div>
                  
                  <div className={`p-4 ${styles.summaryBox} rounded-lg mb-6`}>
                    <div className="flex justify-between mb-2">
                      <span className={styles.subtleText}>Price per {selectedProduct?.unitOfMeasure || 'liter'}:</span>
                      <span>₦{formatPrice(selectedProduct?.unitPrice || 0)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className={styles.subtleText}>Quantity:</span>
                      <span>{quantity} {selectedProduct?.unitOfMeasure || 'liters'}</span>
                    </div>
                    <div className={`flex justify-between font-bold text-lg pt-2 border-t ${styles.divider}`}>
                      <span>Total:</span>
                      <span className="text-emerald-600">₦{formatPrice(calculateFuelCost())}</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
          
          {/* Step 2: Delivery Location */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Delivery Location</h2>
              
              <div className="mb-6">
                <label className={`block mb-2 ${styles.labelText}`}>Delivery Location</label>
                <div className="space-y-3">
                  {user?.addresses?.map((location) => (
                    <div
                      key={location._id}
                      onClick={() => setSelectedLocation(location._id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedLocation === location._id 
                          ? styles.cardSelected
                          : styles.cardUnselected
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${selectedLocation === location._id ? styles.iconBg : styles.iconInactiveBg}`}>
                          <FaMapMarkerAlt className={selectedLocation === location._id ? "text-white" : ""} />
                        </div>
                        <div>
                          <h3 className="font-medium">{location.name || 'Address'}</h3>
                          <p className={`text-sm ${styles.subtleText}`}>
                            {location.address}, {location.city}, {location.state}
                          </p>
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
                <ErrorMessage name="location" />
              </div>
              
              <div className={`p-4 ${styles.summaryBox} rounded-lg mb-6 flex items-start`}>
                <FaInfoCircle className="text-blue-500 mt-1 mr-3" />
                <p className={`text-sm ${isLightMode ? "text-gray-700" : "text-gray-300"}`}>
                  Delivery is available 7 days a week during standard hours (8AM-8PM).
                  Delivery will be scheduled within 24 hours of order confirmation.
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
                  {/* {paymentMethods.map((method) => (
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
                  ))} */}
                  
                  {/* Added Paystack option */}
                  <div
                    onClick={() => setPaymentMethod('paystack')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'paystack' 
                        ? styles.cardSelected
                        : styles.cardUnselected
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${paymentMethod === 'paystack' ? styles.iconBg : styles.iconInactiveBg}`}>
                        <FaCreditCard className={paymentMethod === 'paystack' ? "text-white" : ""} />
                      </div>
                      <div>
                        <h3 className="font-medium">Paystack</h3>
                        <p className={`text-sm ${styles.subtleText}`}>Pay with card, bank transfer, or USSD</p>
                      </div>
                    </div>
                  </div>
                </div>
                <ErrorMessage name="payment" />
              </div>
              
              <div className={`p-4 ${styles.summaryBox} rounded-lg mb-6`}>
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className={styles.subtleText}>Fuel Type:</span>
                    <span>{selectedProduct?.name || ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.subtleText}>Quantity:</span>
                    <span>{quantity} {selectedProduct?.unitOfMeasure || 'liters'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.subtleText}>Price per {selectedProduct?.unitOfMeasure || 'liter'}:</span>
                    <span>₦{formatPrice(selectedProduct?.unitPrice || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.subtleText}>Subtotal:</span>
                    <span>₦{formatPrice(calculateFuelCost())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={styles.subtleText}>Delivery Fee:</span>
                    <span>₦{formatPrice(calculateDeliveryFee())}</span>
                  </div>
                </div>
                <div className={`flex justify-between font-bold text-lg pt-3 border-t ${styles.divider}`}>
                  <span>Total:</span>
                  <span className="text-emerald-600">₦{formatPrice(calculateTotal())}</span>
                </div>
              </div>
              
              <div className={`p-4 ${styles.summaryBox} rounded-lg mb-6 flex items-start`}>
                <FaInfoCircle className="text-blue-500 mt-1 mr-3" />
                <p className={`text-sm ${isLightMode ? "text-gray-700" : "text-gray-300"}`}>
                  You'll be redirected to our secure payment gateway (Paystack) to complete your payment.
                  Your payment information is encrypted and secure.
                </p>
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
                disabled={loading || paymentProcessing}
                className={`px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors ${
                  (loading || paymentProcessing) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {paymentProcessing ? 'Processing...' : loading ? 'Creating Order...' : 'Proceed to Payment'}
              </button>
            )}
          </div>
          
          {/* Error message display */}
          {error && (
            <p className="mt-4 text-red-500 text-center">{error}</p>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default OrderFuel;