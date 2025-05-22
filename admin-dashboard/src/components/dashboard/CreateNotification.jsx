import React, { useState } from 'react';
import { Bell, Send, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import apiService from '@/lib/api';

const CreateNotification = ({ onNotificationCreated }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    message: '',
    type: 'system'
  });

  const notificationTypes = [
    { value: 'Order', label: 'Order' },
    { value: 'user', label: 'User' },
    { value: 'payment', label: 'Payment' },
    { value: 'alert', label: 'Alert' },
    { value: 'system', label: 'System' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      message: '',
      type: 'system'
    });
  };

  const handleSubmit = async () => {
    if (!formData.message.trim()) {
      toast.error('Message is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiService.post('/notifications', formData);
      
      if (response.status === 'success' || response.status === 201) {
        toast.success('Notification created successfully');
        setOpen(false);
        resetForm();
        
        // Call the callback function to refresh notifications
        if (onNotificationCreated) {
          onNotificationCreated();
        }
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error(error.message || 'Failed to create notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Create Notification
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Notification</DialogTitle>
          <DialogDescription>
            Send a notification to a user or the system.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="userId">User ID (Optional)</Label>
            <Input
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="67fa0a6b65f7895eeeb82e20"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to send to all users or system
            </p>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="type">Notification Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter notification message"
              className="min-h-24"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send Notification
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNotification;