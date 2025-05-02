import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const SavedLocations = ({ locations = [] }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-800 dark:text-white">Distribution Locations</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
            onClick={() => navigate('/admin/settings')}
          >
            <FaPlus className="mr-1" size={14} />
            <span>Add</span>
          </Button>
        </CardHeader>
        <CardContent>
          {locations && locations.length > 0 ? (
            <ul className="space-y-3">
              {locations.map((location, index) => (
                <li 
                  key={location._id || index} 
                  className="flex items-start border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0"
                >
                  <FaMapMarkerAlt className="text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{location.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{location.address}</p>
                    <div className="flex mt-1">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                        {location.type || 'Station'}
                      </span>
                      {location.isActive && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded text-green-600 dark:text-green-400 ml-2">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <FaMapMarkerAlt className="mx-auto text-gray-400 text-2xl mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No distribution locations added</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => navigate('/admin/settings')}
              >
                Add your first location
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavedLocations;