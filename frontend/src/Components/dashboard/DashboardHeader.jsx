import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';
import { FaBars, FaTimes, FaMapMarkerAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { ModeToggle } from '../mode-toggle';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const DashboardHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState([
    { id: 1, name: 'Home', address: '14 Admiralty Way, Lekki Phase 1, Lagos', isDefault: true },
    { id: 2, name: 'Office', address: '27 Kofo Abayomi Street, Victoria Island, Lagos', isDefault: false },
    { id: 3, name: 'Warehouse', address: 'Plot 5, Adeola Odeku Street, Victoria Island, Lagos', isDefault: false },
  ]);
  const [newAddress, setNewAddress] = useState({ name: '', address: '' });
  const [selectedTab, setSelectedTab] = useState('saved');
  const [editingAddress, setEditingAddress] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(addresses.find(addr => addr.isDefault));

  // For Google Places Autocomplete
  const [autocompleteLoaded, setAutocompleteLoaded] = useState(false);
  const [placesAutocomplete, setPlacesAutocomplete] = useState(null);

  useEffect(() => {
    // Load Google Places API script
    // Note: In a real application, you would use your own API key
    const loadGooglePlacesAPI = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setAutocompleteLoaded(true);
      document.head.appendChild(script);
    };

    loadGooglePlacesAPI();
  }, []);

  useEffect(() => {
    if (autocompleteLoaded && window.google) {
      initAutocomplete();
    }
  }, [autocompleteLoaded, selectedTab]);

  const initAutocomplete = () => {
    if (document.getElementById('google-places-input')) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById('google-places-input')
      );
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setNewAddress({
            ...newAddress,
            address: place.formatted_address
          });
        }
      });
      
      setPlacesAutocomplete(autocomplete);
    }
  };

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.address) {
      if (editingAddress) {
        // Update existing address
        setAddresses(addresses.map(addr => 
          addr.id === editingAddress.id ? { ...newAddress, id: addr.id, isDefault: addr.isDefault } : addr
        ));
        setEditingAddress(null);
      } else {
        // Add new address
        const newId = Math.max(...addresses.map(addr => addr.id), 0) + 1;
        setAddresses([...addresses, { ...newAddress, id: newId, isDefault: addresses.length === 0 }]);
      }
      
      setNewAddress({ name: '', address: '' });
      setSelectedTab('saved');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress({ name: address.name, address: address.address });
    setSelectedTab('add');
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    
    const defaultAddress = addresses.find(addr => addr.id === id);
    setCurrentAddress(defaultAddress);
    setAddressDialogOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center mb-8 z-20 bg-background/90 dark:bg-gray-900/50 backdrop-blur-2xl dark:border px-6 lg:px-8 py-2 sticky top-6 shadow rounded-2xl"
    >
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 text-xl md:hidden text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:outline-none"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className='hidden lg:block'>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, Oluwaseun</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center text-gray-700 dark:text-gray-300">
              <FaMapMarkerAlt className="mr-2 text-emerald-500" />
              <span className="hidden md:inline">Deliver to:</span>
              <span className="ml-1 font-medium text-emerald-600 dark:text-emerald-400 max-w-[150px] truncate">
                {currentAddress?.name || 'Add address'}
              </span>
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delivery Addresses</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue={selectedTab} value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="saved">Saved Addresses</TabsTrigger>
                <TabsTrigger value="add">{editingAddress ? 'Edit Address' : 'Add New'}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="saved" className="mt-4">
                <ScrollArea className="h-[300px] pr-4">
                  {addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div 
                          key={address.id} 
                          className={`border p-3 rounded-lg relative ${address.isDefault ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium flex items-center">
                                {address.name}
                                {address.isDefault && (
                                  <span className="ml-2 text-xs bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{address.address}</p>
                            </div>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditAddress(address)}
                                className="h-8 w-8 p-0"
                              >
                                <FaEdit className="h-4 w-4 text-gray-500" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteAddress(address.id)}
                                className="h-8 w-8 p-0 text-red-500"
                                disabled={address.isDefault}
                              >
                                <FaTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {!address.isDefault && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700"
                              onClick={() => handleSetDefaultAddress(address.id)}
                            >
                              Set as Default
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No addresses saved yet. Add your first address.
                    </div>
                  )}
                </ScrollArea>
                
                <Button 
                  onClick={() => {
                    setEditingAddress(null);
                    setNewAddress({ name: '', address: '' });
                    setSelectedTab('add');
                  }}
                  className="mt-4 w-full"
                >
                  <FaPlus className="mr-2" /> Add New Address
                </Button>
              </TabsContent>
              
              <TabsContent value="add" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address-name">Address Name</Label>
                    <Input 
                      id="address-name" 
                      placeholder="Home, Office, etc."
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Tabs defaultValue="google" className="w-full">
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="google">Google Places</TabsTrigger>
                        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                      </TabsList>
                      <TabsContent value="google" className="mt-2">
                        <Input 
                          id="google-places-input" 
                          placeholder="Search for an address..."
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Start typing to see suggestions
                        </p>
                      </TabsContent>
                      <TabsContent value="manual" className="mt-2">
                        <Input 
                          id="manual-address" 
                          placeholder="Enter your address..."
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedTab('saved');
                      setEditingAddress(null);
                      setNewAddress({ name: '', address: '' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddAddress} disabled={!newAddress.name || !newAddress.address}>
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
        
        <NotificationBell />
        <ModeToggle />
        <UserAvatar />
      </div>
    </motion.div>
  );
};

export default DashboardHeader;