
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SubmitEventRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitEventRequestDialog = ({ isOpen, onClose }: SubmitEventRequestDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventHyperlink: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit an event request",
        variant: "destructive"
      });
      return;
    }

    if (!formData.eventName.trim()) {
      toast({
        title: "Event name required",
        description: "Please enter the event name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Use raw SQL insert since the table isn't in TypeScript types yet
      const { error } = await supabase.rpc('create_event_request', {
        p_user_id: user.id,
        p_event_name: formData.eventName.trim(),
        p_event_hyperlink: formData.eventHyperlink.trim() || null,
        p_description: formData.description.trim() || null
      });

      if (error) {
        // Fallback to direct insert if RPC doesn't exist
        const { error: insertError } = await supabase
          .from('event_requests' as any)
          .insert({
            user_id: user.id,
            event_name: formData.eventName.trim(),
            event_hyperlink: formData.eventHyperlink.trim() || null,
            description: formData.description.trim() || null,
            status: 'pending'
          });
        
        if (insertError) throw insertError;
      }

      toast({
        title: "Event request submitted!",
        description: "Your event request has been sent for review. We'll get back to you within 24-48 hours.",
      });

      setFormData({ eventName: '', eventHyperlink: '', description: '' });
      onClose();
    } catch (error: any) {
      console.error('Error submitting event request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit event request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Submit Your Event</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Want to sell a ticket for an event that doesn't exist on our platform? 
            Submit the event details here!
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="eventName" className="text-sm font-medium">
                Event Name*
              </Label>
              <Input
                id="eventName"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="eventHyperlink" className="text-sm font-medium">
                Event Hyperlink
              </Label>
              <Input
                id="eventHyperlink"
                type="url"
                placeholder="https://www..."
                value={formData.eventHyperlink}
                onChange={(e) => setFormData({ ...formData, eventHyperlink: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the link to the original event e.g. on Eventbrite, Fatsoma, etc.
              </p>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Additional Details
              </Label>
              <Textarea
                id="description"
                placeholder="Any additional information about the event..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <p className="text-xs text-gray-500">
              Please note: By entering this form, your event is not guaranteed to be on SocialDealer - your request will get accepted/rejected within 24-48 hours.
            </p>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Event Request'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
