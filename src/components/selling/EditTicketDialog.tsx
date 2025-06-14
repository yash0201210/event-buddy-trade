
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Ticket {
  id: string;
  title: string;
  ticket_type: string;
  quantity: number;
  selling_price: number;
  original_price: number;
  is_negotiable: boolean;
  description?: string;
  has_offers: boolean;
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
  const [loading, setLoading] = useState(false);
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
      onSuccess?.(); // Call onSuccess if provided
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Ticket Listing</DialogTitle>
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
