"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Lock, Bell, Shield, Smartphone, Mail, Save, Home, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"
import useAuthStore from "@/stores/useAuthStore"
import apiService from "@/lib/api"
import { Eye, SlashIcon as EyeSlash } from "lucide-react"

export default function Settings() {
  const { user, updateProfile, changePassword } = useAuthStore();
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifyOrderUpdates: true,
    notifyPromotions: false,
    notifyPriceChanges: true,
    addresses: []
  })

  // Initialize form with user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData(prevFormData => ({
        ...prevFormData,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        addresses: user.addresses || []
      }))
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleToggleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Add a new empty address
  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        { street: "", city: "", LGA: "", state: "" }
      ]
    }))
  }

  // Remove an address at the given index
  const removeAddress = (index) => {
    const updatedAddresses = [...formData.addresses]
    updatedAddresses.splice(index, 1)
    setFormData(prev => ({
      ...prev,
      addresses: updatedAddresses
    }))
  }

  // Update an address field
  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...formData.addresses]
    updatedAddresses[index][field] = value
    setFormData(prev => ({
      ...prev,
      addresses: updatedAddresses
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setIsSubmitting(true)
      
      // Create data object for API request
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || "",
        // Strip _id from each address
        addresses: formData.addresses.map(address => {
          const { _id, ...addressWithoutId } = address
          return addressWithoutId
        })
      }
      
      // Using the API directly since we're updating the user's own profile
      const response = await apiService.put("/users/me", profileData)
      
      // Update user in auth store
      if (response.data) {
        await updateProfile(profileData)
        toast.success("Profile information updated successfully")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      toast.error(error.response?.data?.message || "Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSavePassword = async () => {
    // Validation checks
    if (!formData.currentPassword) {
      toast.error("Current password is required");
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
  
    try {
      setIsSubmitting(true);
      
      // Use the auth store function instead of direct API call
      await changePassword(formData.newPassword);
      
      toast.success("Password updated successfully");
  
      // Clear the password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Display user's full name
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''
  
  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user) return ''
    
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    
    return firstName && lastName 
      ? `${firstName.charAt(0)}${lastName.charAt(0)}` 
      : firstName.charAt(0) || ''
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container max-w-6xl mx-auto py-10"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and personal information</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="sm:w-64 shrink-0">
            <Card>
              <CardContent className="p-0">
                <TabsList className="flex flex-col w-full h-auto bg-transparent space-y-1 p-2">
                  <TabsTrigger
                    value="profile"
                    className="w-full justify-start px-3 py-2.5 h-auto data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="w-full justify-start px-3 py-2.5 h-auto data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Security</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="w-full justify-start px-3 py-2.5 h-auto data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    <span>Notifications</span>
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <TabsContent value="profile" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your profile details and personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-background">
                      <AvatarFallback className="bg-emerald-600 text-white text-xl">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{fullName}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm">
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium flex items-center">
                        <Home className="h-5 w-5 mr-2" />
                        Addresses
                      </h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={addAddress}
                        className="flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Address
                      </Button>
                    </div>

                    {formData.addresses.length === 0 ? (
                      <div className="text-center py-6 border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">No addresses added yet</p>
                        <Button 
                          variant="link" 
                          onClick={addAddress}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add your first address
                        </Button>
                      </div>
                    ) : (
                      formData.addresses.map((address, index) => (
                        <Card key={index} className="p-4 relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeAddress(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove address</span>
                          </Button>
                          
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`address-street-${index}`} className="text-xs">
                                Street Address
                              </Label>
                              <Input
                                id={`address-street-${index}`}
                                value={address.street || ""}
                                onChange={(e) => handleAddressChange(index, "street", e.target.value)}
                                placeholder="Street address"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`address-city-${index}`} className="text-xs">
                                City
                              </Label>
                              <Input
                                id={`address-city-${index}`}
                                value={address.city || ""}
                                onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                                placeholder="City"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`address-lga-${index}`} className="text-xs">
                                LGA
                              </Label>
                              <Input
                                id={`address-lga-${index}`}
                                value={address.LGA || ""}
                                onChange={(e) => handleAddressChange(index, "LGA", e.target.value)}
                                placeholder="Local Government Area"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`address-state-${index}`} className="text-xs">
                                State
                              </Label>
                              <Input
                                id={`address-state-${index}`}
                                value={address.state || ""}
                                onChange={(e) => handleAddressChange(index, "state", e.target.value)}
                                placeholder="State"
                              />
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">Saving...</span>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and account security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={passwordVisible ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="pl-10 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            {passwordVisible ? (
                              <EyeSlash className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">{passwordVisible ? "Hide password" : "Show password"}</span>
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-sm">
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm">
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSavePassword}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                        disabled={isSubmitting || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                      >
                        {isSubmitting ? (
                          <span className="animate-pulse">Updating...</span>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Advanced Security</h3>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/40">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 rounded-full bg-primary/10">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-base font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                      </div>
                      <Switch id="2fa" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control which notifications you receive from the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="text-base font-medium">Order Updates</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Receive notifications about your order status changes
                        </p>
                      </div>
                      <Switch
                        id="order-updates"
                        checked={formData.notifyOrderUpdates}
                        onCheckedChange={(checked) => handleToggleChange("notifyOrderUpdates", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="text-base font-medium">Promotional Offers</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Get notified about discounts and special offers
                        </p>
                      </div>
                      <Switch
                        id="promotions"
                        checked={formData.notifyPromotions}
                        onCheckedChange={(checked) => handleToggleChange("notifyPromotions", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="text-base font-medium">Price Changes</h4>
                        <p className="text-sm text-muted-foreground mt-1">Stay updated on fuel price changes</p>
                      </div>
                      <Switch
                        id="price-changes"
                        checked={formData.notifyPriceChanges}
                        onCheckedChange={(checked) => handleToggleChange("notifyPriceChanges", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </motion.div>
  )
}