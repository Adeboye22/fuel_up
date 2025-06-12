import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaGasPump, FaPencilAlt, FaSave, FaTimes, FaTrash, FaPlus } from 'react-icons/fa';
import { MdLocalGasStation } from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import apiService from '@/lib/api';

const FuelPrices = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    unitPrice: 0,
    unitOfMeasure: 'liter'
  });
  
  // Available units of measure as specified by the API validation
  const validUnitsOfMeasure = ['liter', 'gallon', 'kg'];
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  // Function to start editing a product
  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditValues({
      name: product.name,
      unitPrice: product.unitPrice / 100, // Convert from kobo to naira for editing
      unitOfMeasure: product.unitOfMeasure
    });
  };

  // Function to handle input changes for editing
  const handleChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: field === 'unitPrice' && value < 0 ? 0 : value
    }));
  };

  // Function to handle input changes for new product
  const handleNewProductChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: field === 'unitPrice' && value < 0 ? 0 : value
    }));
  };

  // Function to save edited product
  const handleSave = async (productId) => {
    try {
      const updatedProduct = {
        ...editValues,
        unitPrice: Math.round(editValues.unitPrice * 100) // Convert naira back to kobo for API
      };
      
      const response = await apiService.put(`/products/${productId}`, updatedProduct);
      
      if (response.status === 'success') {
        // Update local state with new values
        setProducts(products.map(product => 
          product._id === productId 
            ? { ...product, ...updatedProduct, unitPrice: Math.round(editValues.unitPrice * 100) } 
            : product
        ));
        setEditingId(null);
        toast.success('Fuel price updated successfully');
      } else {
        toast.error('Failed to update fuel price');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Error updating fuel price');
    }
  };

  // Function to create new product
  const handleCreate = async () => {
    if (!newProduct.name.trim()) {
      toast.error('Please provide a valid fuel name');
      return;
    }
    
    if (newProduct.unitPrice <= 0) {
      toast.error('Please provide a valid price greater than zero');
      return;
    }

    try {
      const productToCreate = {
        ...newProduct,
        unitPrice: Math.round(newProduct.unitPrice * 100) // Convert naira to kobo for API
      };
      
      const response = await apiService.post('/products', productToCreate);
      
      if (response.status === 'success') {
        // Add new product to the local state
        setProducts([...products, response.data]);
        
        // Reset new product form
        setNewProduct({
          name: '',
          unitPrice: 0,
          unitOfMeasure: 'Liter'
        });
        
        setIsCreating(false);
        toast.success('New fuel product created successfully');
      } else {
        toast.error('Failed to create fuel product');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      toast.error('Error creating fuel product');
    }
  };

  // Function to delete a product
  const handleDelete = async (productId) => {
    try {
      const response = await apiService.delete(`/products/${productId}`);
      
      if (response.status === 'success') {
        // Remove product from local state
        setProducts(products.filter(product => product._id !== productId));
        setDeleteConfirm(null);
        toast.success('Fuel product deleted successfully');
      } else {
        toast.error('Failed to delete fuel product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Error deleting fuel product');
    }
  };

  // Function to cancel editing
  const handleCancel = () => {
    setEditingId(null);
  };

  // Function to cancel product creation
  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewProduct({
      name: '',
      unitPrice: 0,
      unitOfMeasure: 'Liter'
    });
  };

  // Function to get color based on product name
  const getProductColor = (name) => {
    const nameLC = name.toLowerCase();
    if (nameLC.includes('petrol')) return 'red';
    if (nameLC.includes('diesel')) return 'amber';
    if (nameLC.includes('kerosene')) return 'blue';
    return 'gray'; // default color
  };
  
  // Function to get icon background and text color classes
  const getColorClasses = (name) => {
    const colorName = getProductColor(name);
    switch (colorName) {
      case 'red':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'amber':
        return 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
      case 'blue':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Fuel Prices Administration</h2>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Fuel Prices Administration</h2>
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 p-4 rounded-lg text-red-700 dark:text-red-400">
            {error}. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 mr-3 bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <MdLocalGasStation size={24} />
              </div>
              <h2 className="text-xl font-bold">Fuel Prices Administration</h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" /> Add New Fuel
              </button>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>

          {isCreating && (
            <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-3">Add New Fuel Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Type</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => handleNewProductChange('name', e.target.value)}
                    placeholder="e.g. Diesel, Kerosene"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={newProduct.unitPrice}
                    onChange={(e) => handleNewProductChange('unitPrice', parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                  <select
                    value={newProduct.unitOfMeasure}
                    onChange={(e) => handleNewProductChange('unitOfMeasure', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-3 py-2"
                  >
                    {validUnitsOfMeasure.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={handleCancelCreate}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Create Fuel Product
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800/60 rounded-lg overflow-hidden backdrop-blur-md">
              <thead className="bg-gray-100 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fuel Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price (₦)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700/50">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${getColorClasses(product.name)}`}>
                            <FaGasPump />
                          </div>
                          {editingId === product._id ? (
                            <input
                              type="text"
                              value={editValues.name}
                              onChange={(e) => handleChange('name', e.target.value)}
                              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-2 py-1 text-sm w-full max-w-xs"
                            />
                          ) : (
                            <span className="font-medium text-gray-800 dark:text-white">{product.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === product._id ? (
                          <input
                            type="number"
                            value={editValues.unitPrice}
                            onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value))}
                            min="0"
                            step="0.01"
                            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-2 py-1 text-sm w-full max-w-xs"
                          />
                        ) : (
                          <span className="font-bold text-gray-800 dark:text-white">₦{(product.unitPrice / 100).toLocaleString()}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                        {editingId === product._id ? (
                          <select
                            value={editValues.unitOfMeasure}
                            onChange={(e) => handleChange('unitOfMeasure', e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-2 py-1 text-sm w-full max-w-xs"
                          >
                            {validUnitsOfMeasure.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit.charAt(0).toUpperCase() + unit.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{product.unitOfMeasure.charAt(0).toUpperCase() + product.unitOfMeasure.slice(1)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === product._id ? (
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => handleSave(product._id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 bg-green-500/10 p-2 rounded-md"
                              title="Save changes"
                            >
                              <FaSave className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-500/10 p-2 rounded-md"
                              title="Cancel editing"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </div>
                        ) : deleteConfirm === product._id ? (
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-white bg-red-600 hover:bg-red-700 p-2 rounded-md"
                              title="Confirm delete"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 bg-gray-200 dark:bg-gray-700 p-2 rounded-md"
                              title="Cancel delete"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-500/10 p-2 rounded-md"
                              title="Edit product"
                            >
                              <FaPencilAlt className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-500/10 p-2 rounded-md"
                              title="Delete product"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No fuel products found. Click the "Add New Fuel" button to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FuelPrices;