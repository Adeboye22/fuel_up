import React from 'react';
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const SavedLocations = ({ addresses = [] }) => {
  const navigate = useNavigate();

  // Format address object into a readable string
  const formatAddress = (address) => {
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    
    return parts.join(', ');
  };

  // Generate a name for the address if not provided
  const getAddressName = (address, index) => {
    // Use predefined names for the first three addresses if not provided
    const defaultNames = ['Home', 'Office', 'Site'];
    
    if (address.name) return address.name;
    if (index < defaultNames.length) return defaultNames[index];
    return `Location ${index + 1}`;
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Saved Locations</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
          onClick={() => navigate('/dashboard/settings')}
        >
          <FaPlus className="mr-1" />
          <span>Add</span>
        </Button>
      </CardHeader>
      <CardContent>
        {addresses && addresses.length > 0 ? (
          <ul className="space-y-3">
            {addresses.map((address, index) => (
              <li 
                key={address._id || index} 
                className="flex items-start border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0"
              >
                <FaMapMarkerAlt className="text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{getAddressName(address, index)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{formatAddress(address)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <FaMapMarkerAlt className="mx-auto text-gray-400 text-2xl mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No saved locations</p>
            <Button 
              variant="link" 
              className="mt-2"
              onClick={() => navigate('/dashboard/settings')}
            >
              Add your first location
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedLocations;