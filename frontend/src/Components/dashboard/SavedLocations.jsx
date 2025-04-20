import React from 'react';
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const SavedLocations = ({ locations = [] }) => {
  const navigate = useNavigate();

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
        {locations.length > 0 ? (
          <ul className="space-y-3">
            {locations.map((location, index) => (
              <li 
                key={index} 
                className="flex items-start border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0"
              >
                <FaMapMarkerAlt className="text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-300">{location}</p>
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