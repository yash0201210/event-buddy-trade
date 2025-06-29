
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface Ticket {
  id: string;
  title: string;
  ticket_type: string;
  quantity: number;
  selling_price: number;
  original_price: number;
  is_negotiable: boolean;
  description?: string;
  has_offers?: boolean;
  events: {
    name: string;
    venue: string;
    city: string;
    event_date: string;
  };
}

interface EditTicketDialogProps {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditTicketDialog = ({ ticket, open, onClose, onSuccess }: EditTicketDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPdfReplaceWarning, setShowPdfReplaceWarning] = useState(false);
  const [formData, setFormData] = useState({
    title: ticket.title,
    ticket_type: ticket.ticket_type,
    quantity: ticket.quantity,
    selling_price: ticket.selling_price,
    original_price: ticket.original_price,
    is_negotiable: ticket.is_negotiable,
    description: ticket.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update the ticket
      const { error: updateError } = await supabase
        .from('tickets')
        .update({
          title: formData.title,
          ticket_type: formData.ticket_type,
          quantity: formData.quantity,
          selling_price: formData.selling_price,
          original_price: formData.original_price,
          is_negotiable: formData.is_negotiable,
          description: formData.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticket.id);

      if (updateError) throw updateError;

      // If ticket has offers, notify buyers about the changes
      if (ticket.has_offers) {
        // Get all conversations for this ticket
        const { data: conversations } = await supabase
          .from('conversations')
          .select('id, buyer_id')
          .eq('ticket_id', ticket.id);

        if (conversations) {
          // Send notification message to each buyer
          for (const conversation of conversations) {
            await supabase
              .from('messages')
              .insert({
                conversation_id: conversation.id,
                sender_id: user?.id,
                receiver_id: conversation.buyer_id,
                content: `The seller has updated the ticket details for "${ticket.events.name}". Please review the changes to ensure they still meet your requirements.`,
                message_type: 'system_notification',
              });
          }
        }
      }

      toast({
        title: 'Ticket updated successfully',
        description: ticket.has_offers 
          ? 'Buyers with offers have been notified of the changes.'
          : 'Your ticket listing has been updated.',
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: 'Error updating ticket',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async () => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticket.id);

      if (error) throw error;

      toast({
        title: 'Listing deleted successfully',
        description: 'Your ticket listing has been removed.',
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: 'Error deleting listing',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReplacePdf = () => {
    // Delete the current listing and redirect to sell tickets page
    handleDeleteListing().then(() => {
      navigate('/sell-tickets');
    });
  };

  if (showDeleteConfirm) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                If you have active offers or conversations, they will be lost permanently.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteListing}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Deleting...' : 'Delete Listing'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showPdfReplaceWarning) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Replace Ticket PDF</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Replacing your ticket PDF will delete your current listing and redirect you to create a new one. This ensures ticket legitimacy.
              </AlertDescription>
            </Alert>

            <p className="text-gray-600">
              Your current listing, including any active offers or conversations, will be permanently lost.
            </p>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowPdfReplaceWarning(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReplacePdf}
                disabled={loading}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {loading ? 'Processing...' : 'Confirm & Replace'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Listing</DialogTitle>
        </DialogHeader>

        {ticket.has_offers && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This ticket has active offers. Buyers will be automatically notified of any changes you make.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Ticket Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="ticket_type">Ticket Type</Label>
            <Input
              id="ticket_type"
              value={formData.ticket_type}
              onChange={(e) => setFormData({ ...formData, ticket_type: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="selling_price">Selling Price (€)</Label>
              <Input
                id="selling_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="original_price">Original Price (€)</Label>
            <Input
              id="original_price"
              type="number"
              step="0.01"
              min="0"
              value={formData.original_price}
              onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about your ticket..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_negotiable"
              checked={formData.is_negotiable}
              onChange={(e) => setFormData({ ...formData, is_negotiable: e.target.checked })}
            />
            <Label htmlFor="is_negotiable">Open to negotiations</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowPdfReplaceWarning(true)}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Replace PDF
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
