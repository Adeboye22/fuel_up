import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBoxOpen, 
  FaUsers, 
  FaDollarSign, 
  FaExclamationTriangle 
} from 'react-icons/fa';
import { MdLocalGasStation } from 'react-icons/md';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import apiService from '@/lib/api';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentOrders from '@/components/dashboard/RecentOrders';
import FuelPrices from '@/components/dashboard/FuelPrices';
import SavedLocations from '@/components/dashboard/SavedLocations';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await apiService.get('/admin/dashboard/stats');
        if (statsResponse.status === 'success') {
          setStats(statsResponse.data);
        }
        
        // Fetch recent orders
        const ordersResponse = await apiService.get('/admin/orders/recent');
        if (ordersResponse.status === 'success') {
          setRecentOrders(ordersResponse.data);
        }
        
        // Fetch locations
        const locationsResponse = await apiService.get('/admin/locations');
        if (locationsResponse.status === 'success') {
          setLocations(locationsResponse.data);
        }
        
        // Fetch chart data
        const chartResponse = await apiService.get('/admin/dashboard/sales-chart');
        if (chartResponse.status === 'success') {
          setChartData(chartResponse.data);
        }
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Sample locations data (in case API doesn't return any)
  const sampleLocations = [
    { _id: '1', name: 'Lagos Main Terminal', address: 'Apapa, Lagos', type: 'Terminal', isActive: true },
    { _id: '2', name: 'Abuja Distribution Center', address: 'Central District, Abuja', type: 'Station', isActive: true },
    { _id: '3', name: 'Port Harcourt Depot', address: 'Trans Amadi, Port Harcourt', type: 'Depot', isActive: false }
  ];

  // Sample chart data if API doesn't return any
  const sampleChartData = [
    { name: 'Jan', petrol: 400, diesel: 240, kerosene: 240 },
    { name: 'Feb', petrol: 300, diesel: 139, kerosene: 221 },
    { name: 'Mar', petrol: 200, diesel: 980, kerosene: 229 },
    { name: 'Apr', petrol: 278, diesel: 390, kerosene: 200 },
    { name: 'May', petrol: 189, diesel: 480, kerosene: 218 },
    { name: 'Jun', petrol: 239, diesel: 380, kerosene: 250 },
    { name: 'Jul', petrol: 349, diesel: 430, kerosene: 210 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders || 0} 
          icon={<FaBoxOpen />} 
          color="blue"
          loading={loading} 
        />
        <StatCard 
          title="Users" 
          value={stats.totalUsers || 0} 
          icon={<FaUsers />} 
          color="green"
          loading={loading} 
        />
        <StatCard 
          title="Revenue" 
          value={`₦${(stats.totalRevenue || 0).toLocaleString()}`} 
          icon={<FaDollarSign />} 
          color="purple"
          loading={loading} 
        />
        <StatCard 
          title="Pending Orders" 
          value={stats.pendingOrders || 0} 
          icon={<FaExclamationTriangle />} 
          color="amber"
          loading={loading} 
        />
      </motion.div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts & Fuel Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Sales Overview</h3>
              <Tabs defaultValue="monthly" className="w-[200px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="weekly">Week</TabsTrigger>
                  <TabsTrigger value="monthly">Month</TabsTrigger>
                  <TabsTrigger value="yearly">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="h-[300px]">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-full text-red-500">
                  {error}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData.length > 0 ? chartData : sampleChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Line type="monotone" dataKey="petrol" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="diesel" stroke="#F59E0B" strokeWidth={2} />
                    <Line type="monotone" dataKey="kerosene" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Petrol</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Diesel</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Kerosene</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fuel Prices */}
        <div className="col-span-1">
          <SavedLocations locations={locations.length > 0 ? locations : sampleLocations} />
        </div>
      </div>

      {/* Current Fuel Prices */}
      <FuelPrices />

      {/* Recent Orders */}
      <RecentOrders orders={recentOrders} loading={loading} error={error} />
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, loading }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'green':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'purple':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
      case 'amber':
        return 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
      <CardContent className="flex items-center p-6">
        <div className={`rounded-full p-4 mr-4 ${getColorClasses()}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          {loading ? (
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
          ) : (
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;