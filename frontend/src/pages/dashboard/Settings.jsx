"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Lock, Bell, Camera, Eye, SlashIcon as EyeSlash, Shield, Smartphone, Mail, Save, Fuel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function Settings() {
  const [passwordVisible, setPasswordVisible] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 801 234 5678",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifyOrderUpdates: true,
    notifyPromotions: false,
    notifyPriceChanges: true,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    toast({
      title: "Success",
      description: "Profile information updated successfully.",
    })
  }

  const handleSavePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Password updated successfully.",
    })

    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container max-w-6xl mx-auto px-4 py-10"
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
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-4 border-background">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">JD</AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 shadow-md"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change profile photo</span>
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Profile Photo</p>
                      <p className="text-sm text-muted-foreground">Upload a new photo or avatar</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
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
                        />
                      </div>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
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

                  <div className="flex justify-end">
                    <Button
                        onClick={handleSaveProfile}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
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
                    >
                        <Save className="h-4 w-4" />
                        Update Password
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

