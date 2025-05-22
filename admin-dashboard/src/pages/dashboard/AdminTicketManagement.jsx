import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '@/stores/useAuthStore';

// UI Components
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import apiService from '@/lib/api';
import CreateCategoryComponent from '@/components/dashboard/CreateCategoryComponent';

// Import the new component

const AdminTicketManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('ALL');
  const { user } = useAuthStore();
  
  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
    fetchTickets();
  }, [activeTab, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.get('/support/categories');
      if (response.status === 'success') {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load support categories');
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query based on active tab
      let queryParams = `?page=${currentPage}`;
      if (activeTab !== 'ALL') {
        queryParams += `&status=${activeTab}`;
      }
      if (searchTerm) {
        queryParams += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await apiService.get(`/support/tickets${queryParams}`);
      
      if (response.status === 'success') {
        setTickets(response.data.data);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } else {
        setError('Failed to fetch tickets');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('An error occurred while fetching tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await apiService.patch(`/support/tickets/${ticketId}/status`, {
        status: newStatus
      });
      
      if (response.status === 'success') {
        toast.success(`Ticket marked as ${newStatus.toLowerCase()}`);
        fetchTickets();
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
      toast.error('Failed to update ticket status');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchTickets();
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handler for when a new category is created
  const handleCategoryCreated = (newCategory) => {
    setCategories(prevCategories => [...prevCategories, newCategory]);
  };

  // Helper function to get category name by ID
  const getCategoryNameById = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderTicketStatus = (status) => {
    switch (status) {
      case 'OPEN':
        return <Badge>Open</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">In Progress</Badge>;
      case 'CLOSED':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Closed</Badge>;
      case 'RESOLVED':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between border-t px-2 py-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show current page and surrounding pages
            let pageToShow;
            if (totalPages <= 5) {
              pageToShow = i + 1;
            } else {
              let start = Math.max(currentPage - 2, 1);
              let end = Math.min(start + 4, totalPages);
              start = Math.max(end - 4, 1);
              pageToShow = start + i;
            }
            
            if (pageToShow <= totalPages) {
              return (
                <Button 
                  key={pageToShow}
                  variant={currentPage === pageToShow ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageToShow)}
                >
                  {pageToShow}
                </Button>
              );
            }
            return null;
          })}
          
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>Support Ticket Management</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <CreateCategoryComponent onCategoryCreated={handleCategoryCreated} />
            <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="ALL" 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="OPEN">Open</TabsTrigger>
            <TabsTrigger value="IN_PROGRESS">In Progress</TabsTrigger>
            <TabsTrigger value="RESOLVED">Resolved</TabsTrigger>
            <TabsTrigger value="CLOSED">Closed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-destructive">{error}</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center p-8">
                <p>No tickets found.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="max-w-xs">Message</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id.substring(0, 8)}...</TableCell>
                        <TableCell>{ticket.userId.substring(0, 8)}...</TableCell>
                        <TableCell>{getCategoryNameById(ticket.category)}</TableCell>
                        <TableCell className="max-w-xs truncate">{ticket.message}</TableCell>
                        <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                        <TableCell>{renderTicketStatus(ticket.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Update Status
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {ticket.status !== 'OPEN' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketStatus(ticket.id, 'OPEN')}>
                                  Mark as Open
                                </DropdownMenuItem>
                              )}
                              {ticket.status !== 'IN_PROGRESS' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketStatus(ticket.id, 'IN_PROGRESS')}>
                                  Mark as In Progress
                                </DropdownMenuItem>
                              )}
                              {ticket.status !== 'RESOLVED' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketStatus(ticket.id, 'RESOLVED')}>
                                  Mark as Resolved
                                </DropdownMenuItem>
                              )}
                              {ticket.status !== 'CLOSED' && (
                                <DropdownMenuItem onClick={() => handleUpdateTicketStatus(ticket.id, 'CLOSED')}>
                                  Mark as Closed
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {renderPagination()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminTicketManagement;