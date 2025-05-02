import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaCog, 
  FaBell, 
  FaKey, 
  FaPalette, 
  FaGlobe, 
  FaServer, 
  FaShieldAlt 
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';
import apiService from '@/lib/api';
import useAuthStore from '@/stores/useAuthStore';

const AdminSettings = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: ''
  });
  
  // System settings
  const [systemSettings, setSystemSettings] = useState({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    orderIdPrefix: 'FUL',
    dateFormat: 'DD/MM/YYYY',
    enableAnalytics: true
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    systemAlerts: true,
    marketingUpdates: false,
    priceAlerts: true
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordRequirements: 'strong',
    ipRestriction: false
  });
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
    }
    
    fetchSettings();
  }, [user]);
  
  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Fetch all settings
      const response = await apiService.get('/admin/settings');
      
      if (response.status === 'success') {
        // Update settings with fetched data
        if (response.data.system) {
          setSystemSettings({...systemSettings, ...response.data.system});
        }
        
        if (response.data.notifications) {
          setNotificationSettings({...notificationSettings, ...response.data.notifications});
        }
        
        if (response.data.security) {
          setSecuritySettings({...securitySettings, ...response.data.security});
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true);
      
      const response = await apiService.put('/admin/profile', profileData);
      
      if (response.status === 'success') {
        setUser({...user, ...profileData});
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handleChangePassword = async () => {
    // Validate password match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      setSaveLoading(true);
      
      const response = await apiService.put('/admin/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.status === 'success') {
        toast.success('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handleSaveSystemSettings = async () => {
    try {
      setSaveLoading(true);
      
      const response = await apiService.put('/admin/settings/system', systemSettings);
      
      if (response.status === 'success') {
        toast.success('System settings saved');
      }
    } catch (error) {
      console.error('Error saving system settings:', error);
      toast.error('Failed to save system settings');
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handleSaveNotificationSettings = async () => {
    try {
      setSaveLoading(true);
      
      const response = await apiService.put('/admin/settings/notifications', notificationSettings);
      
      if (response.status === 'success') {
        toast.success('Notification preferences saved');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to save notification preferences');
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handleSaveSecuritySettings = async () => {
    try {
      setSaveLoading(true);
      
      const response = await apiService.put('/admin/settings/security', securitySettings);
      
      if (response.status === 'success') {
        toast.success('Security settings saved');
      }
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast.error('Failed to save security settings');
    } finally {
      setSaveLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 md:w-fit">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FaUser className="text-blue-500" />
                <CardTitle>Profile Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    placeholder="First Name" 
                    value={profileData.firstName} 
                    onChange={handleProfileChange} 
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Last Name" 
                    value={profileData.lastName} 
                    onChange={handleProfileChange} 
                  />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="Email Address" 
                    value={profileData.email} 
                    onChange={handleProfileChange} 
                    disabled 
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="Phone Number" 
                    value={profileData.phone} 
                    onChange={handleProfileChange} 
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saveLoading}>
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FaKey className="text-amber-500" />
                <CardTitle>Change Password</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  name="currentPassword" 
                  type="password" 
                  placeholder="Current Password" 
                  value={passwordData.currentPassword} 
                  onChange={handlePasswordChange} 
                />
              </div>
              
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword" 
                    type="password" 
                    placeholder="New Password" 
                    value={passwordData.newPassword} 
                    onChange={handlePasswordChange} 
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    placeholder="Confirm New Password" 
                    value={passwordData.confirmPassword} 
                    onChange={handlePasswordChange} 
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleChangePassword} disabled={saveLoading}>
                  {saveLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FaCog className="text-purple-500" />
                <CardTitle>System Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaPalette className="text-gray-500" />
                    <Label htmlFor="theme">Theme</Label>
                  </div>
                  <Select
                    value={systemSettings.theme}
                    onValueChange={(value) => setSystemSettings({...systemSettings, theme: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaGlobe className="text-gray-500" />
                    <Label htmlFor="language">Language</Label>
                  </div>
                  <Select
                    value={systemSettings.language}
                    onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaGlobe className="text-gray-500" />
                    <Label htmlFor="timezone">Timezone</Label>
                  </div>
                  <Select
                    value={systemSettings.timezone}
                    onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                      <SelectItem value="WAT">WAT (West Africa Time)</SelectItem>
                      <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaServer className="text-gray-500" />
                    <Label htmlFor="dateFormat">Date Format</Label>
                  </div>
                  <Select
                    value={systemSettings.dateFormat}
                    onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Date Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="orderIdPrefix">Order ID Prefix</Label>
                  <Input 
                    id="orderIdPrefix" 
                    value={systemSettings.orderIdPrefix} 
                    onChange={(e) => setSystemSettings({...systemSettings, orderIdPrefix: e.target.value})}
                    className="max-w-[150px]"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <Switch
                    id="enableAnalytics"
                    checked={systemSettings.enableAnalytics}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, enableAnalytics: checked})}
                  />
                  <Label htmlFor="enableAnalytics">Enable Analytics</Label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSystemSettings} disabled={saveLoading}>
                  {saveLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FaBell className="text-amber-500" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Notification Types</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="orderUpdates"
                      checked={notificationSettings.orderUpdates}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderUpdates: checked})}
                    />
                    <Label htmlFor="orderUpdates">Order updates</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="systemAlerts"
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemAlerts: checked})}
                    />
                    <Label htmlFor="systemAlerts">System alerts</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="priceAlerts"
                      checked={notificationSettings.priceAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, priceAlerts: checked})}
                    />
                    <Label htmlFor="priceAlerts">Price alerts</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="marketingUpdates"
                      checked={notificationSettings.marketingUpdates}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingUpdates: checked})}
                    />
                    <Label htmlFor="marketingUpdates">Marketing updates</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveNotificationSettings} disabled={saveLoading}>
                  {saveLoading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="text-green-500" />
                <CardTitle>Security Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="passwordRequirements">Password Requirements</Label>
                  <Select
                    value={securitySettings.passwordRequirements}
                    onValueChange={(value) => setSecuritySettings({...securitySettings, passwordRequirements: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Requirements" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (min. 8 characters)</SelectItem>
                      <SelectItem value="medium">Medium (min. 10 chars, mixed case)</SelectItem>
                      <SelectItem value="strong">Strong (min. 12 chars, mixed case, numbers, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Switch
                    id="ipRestriction"
                    checked={securitySettings.ipRestriction}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, ipRestriction: checked})}
                  />
                  <div>
                    <Label htmlFor="ipRestriction">IP Address Restriction</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Limit access to specific IP addresses</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSecuritySettings} disabled={saveLoading}>
                  {saveLoading ? 'Saving...' : 'Save Security Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AdminSettings;