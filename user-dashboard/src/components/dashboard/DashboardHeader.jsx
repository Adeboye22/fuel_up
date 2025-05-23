"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import NotificationBell from "./NotificationBell"
import UserAvatar from "./UserAvatar"
import { ModeToggle } from "../mode-toggle"
import { useNavigate } from "react-router-dom"
import useAuthStore from "@/stores/useAuthStore"
import { MapPin, Menu, X, Plus, Trash2, Edit, LogOut, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-hot-toast"

const DashboardHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [currentAddress, setCurrentAddress] = useState(null)
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
  })
  const [selectedTab, setSelectedTab] = useState("saved")
  const [editingAddress, setEditingAddress] = useState(null)

  // Get user's first name to display
  const firstName = user?.firstName || "User"

  // Logout handler
  const handleLogout = () => {
    logout()
    navigate("/signin")
  }

  // Update addresses when user data changes
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      setAddresses(
        user.addresses.map((addr, index) => ({
          ...addr,
          id: addr._id || index + 1,
          isDefault: addr.isDefault || index === 0, // Use existing isDefault or set first as default
        })),
      )

      // Find default address or use first one
      const defaultAddr = user.addresses.find((addr) => addr.isDefault) || user.addresses[0]
      setCurrentAddress(defaultAddr)
    } else {
      setAddresses([])
      setCurrentAddress(null)
    }
  }, [user])

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.address) {
      toast.error("Please provide both name and address")
      return
    }

    if (editingAddress) {
      // Update existing address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id ? { ...newAddress, id: addr.id, isDefault: addr.isDefault } : addr,
        ),
      )
      setEditingAddress(null)
    } else {
      // Add new address
      const newId = Math.max(...(addresses.length ? addresses.map((addr) => addr.id) : [0]), 0) + 1
      setAddresses([...addresses, { ...newAddress, id: newId, isDefault: addresses.length === 0 }])
    }

    setNewAddress({ name: "", address: "" })
    setSelectedTab("saved")
    toast.success(editingAddress ? "Address updated successfully" : "Address added successfully")
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setNewAddress({
      name: address.name,
      address: address.address,
      city: address.city || "",
      state: address.state || "",
    })
    setSelectedTab("add")
  }

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  const handleSetDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )

    const defaultAddress = addresses.find((addr) => addr.id === id)
    setCurrentAddress(defaultAddress)
    setAddressDialogOpen(false)
  }

  const validateAddress = async (address) => {
    try {
      // This is a placeholder for actual geocoding API integration
      // You would typically use Google Maps, Mapbox, or similar service
      console.log("Validating address:", address)
      return true
    } catch (error) {
      console.error("Address validation error:", error)
      return false
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center mb-6 z-20 bg-background/90 dark:bg-gray-800/40 backdrop-blur-2xl dark:border-b dark:border-gray-800 border-gray-700/50 rounded-xl px-4 lg:px-8 py-4 sticky top-4 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:outline-none transition-colors md:hidden"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {firstName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300 px-3 py-2 h-9 rounded-full transition-all hover:shadow-md"
            >
              <MapPin size={16} className="text-emerald-500" />
              <span className="hidden md:inline text-xs font-normal">Deliver to:</span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 max-w-32 truncate">
                {currentAddress?.name || "Add address"}
              </span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin size={18} className="text-emerald-500" />
                Delivery Addresses
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="saved" value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="saved">Saved Addresses</TabsTrigger>
                <TabsTrigger value="add">{editingAddress ? "Edit Address" : "Add New"}</TabsTrigger>
              </TabsList>

              <TabsContent value="saved" className="mt-4">
                <ScrollArea className="h-72 pr-4">
                  {addresses.length > 0 ? (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border rounded-xl flex flex-col gap-2 transition-all hover:shadow-sm ${
                            address.isDefault
                              ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-900/10"
                              : "border-gray-200 dark:border-gray-800"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{address.name}</h4>
                              {address.isDefault && (
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 font-normal py-0"
                                >
                                  Default
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={() => handleEditAddress(address)}
                              >
                                <Edit
                                  size={14}
                                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                <Trash2
                                  size={14}
                                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {address.street}
                            {address.city && `, ${address.city}`}
                            {address.state && `, ${address.state}`}
                          </p>
                          {!address.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="mt-1 text-xs w-fit self-end hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                            >
                              <Check size={12} className="mr-1" />
                              Set as Default
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <MapPin className="mx-auto mb-2" size={24} />
                      <p>No saved addresses</p>
                      <Button variant="link" onClick={() => setSelectedTab("add")} className="mt-2">
                        Add a new address
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="add" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Address Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Home, Office, etc."
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-input" className="text-sm font-medium">
                      Street Address
                    </Label>
                    <Input
                      id="address-input"
                      placeholder="Enter your street address"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">
                        City
                      </Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={newAddress.city || ""}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">
                        State
                      </Label>
                      <Input
                        id="state"
                        placeholder="State"
                        value={newAddress.state || ""}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              {selectedTab === "add" && (
                <Button onClick={handleAddAddress} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  {editingAddress ? "Update Address" : "Save Address"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <MapPin size={18} className="text-emerald-500 sm:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Current delivery address</p>
              <p className="font-medium truncate">{currentAddress?.name || "None selected"}</p>
            </div>
            <DropdownMenuSeparator />
            {addresses.slice(0, 3).map((address) => (
              <DropdownMenuItem
                key={address.id}
                onClick={() => handleSetDefaultAddress(address.id)}
                className="cursor-pointer flex justify-between items-center"
              >
                <div className="truncate">
                  <span className="font-medium">{address.name}</span>
                  {address.isDefault && <span className="ml-2 text-xs text-emerald-600">• Default</span>}
                </div>
                {!address.isDefault && (
                  <Check size={14} className="opacity-0 group-hover:opacity-100 text-emerald-500" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setAddressDialogOpen(true)} className="cursor-pointer">
              <Plus size={14} className="mr-2" />
              Manage addresses
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-8 hidden sm:block" />

        <NotificationBell />
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer ml-1">
              <UserAvatar user={user} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col space-y-1 p-2">
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400 focus:text-red-700 cursor-pointer"
            >
              <LogOut size={14} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}

export default DashboardHeader
