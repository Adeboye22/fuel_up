"use client"

import { useState } from "react"
import { User, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import useAuthStore from "@/stores/useAuthStore"
import useDispatchStore from "@/stores/useDispatchStore"
import LoadingSpinner from "@/components/LoadingSpinner"
import { ThemeToggleInline } from "@/components/theme-toggle-inline"

const Account = () => {
  const { user, updateProfile, loading } = useAuthStore()
  const { riderStatus, toggleRiderStatus } = useDispatchStore()

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await updateProfile(formData)
    if (result.success) {
      setIsEditing(false)
    }
  }

  const handleStatusToggle = async () => {
    await toggleRiderStatus()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Rider Status</CardTitle>
          <CardDescription>Toggle your availability to receive delivery assignments as a driver</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{riderStatus === "online" ? "Online" : "Offline"}</p>
              <p className="text-sm text-gray-500">
                {riderStatus === "online" ? "You are available for deliveries" : "You will not receive new assignments"}
              </p>
            </div>
            <Switch checked={riderStatus === "online"} onCheckedChange={handleStatusToggle} />
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Choose your preferred theme for the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Appearance</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select your preferred theme or use system setting
              </p>
            </div>
            <ThemeToggleInline />
          </div>
        </CardContent>
      </Card>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? <LoadingSpinner size="sm" /> : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Account
