import React, { useState } from 'react';
import SavedLocations from '../../components/dashboard/SavedLocations'
import RecentOrders from '../../components/dashboard/RecentOrders'
import FuelPrices from '../../components/dashboard/FuelPrices'
import QuickActions from '../../components/dashboard/QuickActions'

const DashboardHome = () => {
  // Mock data for demonstration
  const [fuelPrices] = useState({
    petrol: 790,
    diesel: 925,
    kerosene: 850
  });
  
  const [recentOrders] = useState([
    { id: 'ORD-7842', date: 'Mar 8, 2025', type: 'Petrol', amount: '25L', status: 'Delivered', price: 19750 },
    { id: 'ORD-7835', date: 'Mar 5, 2025', type: 'Diesel', amount: '40L', status: 'In Transit', price: 37000 },
    { id: 'ORD-7819', date: 'Feb 28, 2025', type: 'Petrol', amount: '30L', status: 'Delivered', price: 23700 }
  ]);
  
  const [savedLocations] = useState([
    'Home - 15 Adeola Odeku St, Victoria Island',
    'Office - 24 Broad Street, Lagos Island',
    'Site - Plot 45, Lekki Phase 1'
  ]);

  return (
    <>
      <QuickActions />
      <FuelPrices prices={fuelPrices} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentOrders orders={recentOrders} />
        <SavedLocations locations={savedLocations} />
      </div>
    </>
  );
};

export default DashboardHome;