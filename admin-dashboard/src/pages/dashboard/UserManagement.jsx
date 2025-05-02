import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaFileExport, FaPlus, FaUserEdit, FaTrash, FaUserLock } from 'react-icons/fa';
import apiService from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { Switch } from "@/components/ui/switch";
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'user', // Changed from 'customer' to 'user' based on your API
      isActive: true
    }
  });

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      // Updated endpoint to include pagination parameters
      const response = await apiService.get(`/users?page=${page}&limit=${perPage}`);
      
      if (response.status === 'success') {
        // Adjusted to match the nested data structure from your API
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setPerPage(response.data.pageSize);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, perPage]); // Refetch when page or perPage changes

  // Apply filters when search term or role filter changes
  useEffect(() => {
    if (searchTerm === '' && roleFilter === 'all') {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => {
      const matchesSearch = 
        searchTerm === '' || 
        user._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm);
      
      const matchesRole = 
        roleFilter === 'all' || 
        user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
    
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get role badge styling
  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400';
      case 'staff':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400';
      case 'driver':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
      case 'user': // Changed from 'customer' to 'user'
        return 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400';
      default:
        return 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400';
    }
  };

  // View user details
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setUserDetailsOpen(true);
    setIsEditMode(false);
    
    // Set form values
    form.reset({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user', // Changed from 'customer' to 'user'
      isActive: user.isVerified !== false // Using isVerified instead of isActive
    });
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Handle user update
  const handleUpdateUser = async (data) => {
    try {
      setLoading(true);
      // Updated endpoint to match your API
      const response = await apiService.patch(`/users/${selectedUser._id}`, data);
      
      if (response.status === 'success') {
        // Update local state
        const updatedUsers = users.map(user => 
          user._id === selectedUser._id ? { ...user, ...data } : user
        );
        setUsers(updatedUsers);
        
        toast.success("User updated successfully");
        setIsEditMode(false);
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle user role update
  const handleRoleUpdate = async (userId, role) => {
    try {
      setLoading(true);
      // Updated endpoint to match your API for role updates
      const response = await apiService.patch(`/users/${userId}`, { role });
      
      if (response.status === 'success') {
        // Update local state
        const updatedUsers = users.map(user => 
          user._id === userId ? { ...user, role } : user
        );
        setUsers(updatedUsers);
        
        toast.success("User role updated successfully");
      } else {
        toast.error("Failed to update user role");
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle user delete
  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      // Updated endpoint to match your API
      const response = await apiService.delete(`/users/${selectedUser._id}`);
      
      if (response.status === 'success') {
        // Update local state
        const updatedUsers = users.filter(user => user._id !== selectedUser._id);
        setUsers(updatedUsers);
        
        toast.success("User deleted successfully");
        setDeleteConfirmOpen(false);
        setUserDetailsOpen(false);
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle user creation
  const handleCreateUser = async (data) => {
    try {
      setLoading(true);
      // Updated endpoint to match your API
      const response = await apiService.post('/users', data);
      
      if (response.status === 'success') {
        // Refetch users to get the updated list
        fetchUsers(currentPage);
        
        toast.success("User created successfully");
        setCreateUserOpen(false);
        form.reset();
      } else {
        toast.error("Failed to create user");
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Open create user dialog
  const openCreateUserDialog = () => {
    form.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'user', // Changed from 'customer' to 'user'
      isActive: true
    });
    setCreateUserOpen(true);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={openCreateUserDialog}>
          <FaPlus className="mr-2" /> Create User
        </Button>
      </div>

      {/* Filters & search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search by name, email or phone..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="user">User</SelectItem> {/* Changed from 'customer' to 'user' */}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <FaFileExport size={14} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No users found matching your criteria
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {user.firstName && user.lastName ? (
                          <span className="text-xs font-medium">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        ) : (
                          <span className="text-xs font-medium">U</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500">{user._id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.phone || 'No phone'}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleStyle(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.isVerified !== false ? 'outline' : 'secondary'} 
                      className={user.isVerified !== false ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}
                    >
                      {user.isVerified !== false ? 'Verified' : 'Unverified'} {/* Changed from Active/Inactive to Verified/Unverified */}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <FaFilter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewUserDetails(user)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          viewUserDetails(user);
                          setTimeout(() => setIsEditMode(true), 100);
                        }}>
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                          setSelectedUser(user);
                          setDeleteConfirmOpen(true);
                        }}>
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination - updated to use server-side pagination */}
      {!loading && !error && filteredUsers.length > 0 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              // Logic to show correct page numbers when there are many pages
              let pageNum = i + 1;
              
              if (totalPages > 5) {
                if (currentPage > 3 && currentPage < totalPages - 2) {
                  pageNum = currentPage - 2 + i;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 5 + i + 1;
                }
              }
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink 
                    onClick={() => handlePageChange(pageNum)}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* User Details Dialog */}
      <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{isEditMode ? 'Edit User' : 'User Details'}</span>
              {!isEditMode && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleEditMode}
                  className="flex items-center gap-2"
                >
                  <FaUserEdit size={14} /> Edit
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateUser)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditMode} 
                            placeholder="First Name" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditMode} 
                            placeholder="Last Name" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditMode} 
                            placeholder="Email Address" 
                            type="email" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditMode} 
                            placeholder="Phone Number" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Role</FormLabel>
                        <Select 
                          disabled={!isEditMode} 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="driver">Driver</SelectItem>
                            <SelectItem value="user">User</SelectItem> {/* Changed from 'customer' to 'user' */}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Verification Status</FormLabel> {/* Changed from "Active Status" */}
                          <FormDescription>
                            {field.value ? "User is verified" : "User is not verified"} {/* Changed wording */}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!isEditMode}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                {!isEditMode && selectedUser.addresses && selectedUser.addresses.length > 0 && (
                  <div className="rounded-lg border p-4 space-y-4">
                    <h3 className="font-medium">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.addresses.map((address, index) => (
                        <div key={address._id || index} className="p-3 border rounded-md">
                          <p><strong>Street:</strong> {address.street}</p>
                          <p><strong>City:</strong> {address.city}</p>
                          <p><strong>LGA:</strong> {address.LGA}</p>
                          <p><strong>State:</strong> {address.state}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {!isEditMode && (
                  <div className="rounded-lg border p-4 space-y-4">
                    <h3 className="font-medium">User Activity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Joined Date</p>
                        <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                        <p className="font-medium">{formatDate(selectedUser.updatedAt)}</p>
                      </div>
                      {/* We don't have these fields in the API response, so removing them 
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Orders Placed</p>
                        <p className="font-medium">{selectedUser.orderCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                        <p className="font-medium">₦{(selectedUser.totalSpent || 0).toLocaleString()}</p>
                      </div>
                      */}
                    </div>
                  </div>
                )}
                
                <DialogFooter className="gap-2">
                  {isEditMode ? (
                    <>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setUserDetailsOpen(false)}
                      >
                        Close
                      </Button>
                      <Button 
                        type="button" 
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => setDeleteConfirmOpen(true)}
                      >
                        <FaTrash className="mr-2" /> Delete User
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. All fields are required.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="First Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Last Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Email Address" type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Phone Number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="driver">Driver</SelectItem>
                          <SelectItem value="user">User</SelectItem> {/* Changed from 'customer' to 'user' */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Verification Status</FormLabel>
                          <FormDescription>
                            {field.value ? "User will be verified" : "User will not be verified"}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter className="gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCreateUserOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Create User
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
  
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600">Confirm Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="border rounded-md p-4 mt-2 mb-4">
                <div className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</div>
                <div className="text-sm text-gray-500">{selectedUser.email}</div>
                <div className="text-sm text-gray-500 mt-2">
                  Role: {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                </div>
              </div>
            )}
            
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteUser}
              >
                <FaTrash className="mr-2" /> Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  
        {/* Role Update Dialog (optional, if needed for quick role updates) */}
        {/* You could add a dialog for quickly changing user roles without opening the full edit form */}
  
        {/* Reset Password Dialog (optional, if needed) */}
        {/* You could add a dialog for password reset functionality */}
      </motion.div>
    );
  };
  
  export default UserManagement;