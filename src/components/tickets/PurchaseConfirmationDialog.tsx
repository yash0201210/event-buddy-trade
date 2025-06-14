
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, CreditCard, Shield } from 'lucide-react';

interface TicketInfo {
  id: string;
  selling_price: number;
  quantity: number;
  ticket_type: string;
  events: {
    name: string;
    venue: string;
    city: string;
    event_date: string;
  };
}

interface PurchaseConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ticket: TicketInfo;
}

export const PurchaseConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  ticket
}: PurchaseConfirmationDialogProps) => {
  const totalAmount = ticket.selling_price * ticket.quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
          <DialogDescription>
            Review your order details before proceeding
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{ticket.events.name}</h3>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(ticket.events.event_date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{ticket.events.venue}, {ticket.events.city}</span>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">{ticket.quantity} X {ticket.ticket_type}</span>
                <span className="font-semibold">€{ticket.selling_price}</span>
              </div>
              
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Confirmed Amount</span>
                <span>€{totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">How it works</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your purchase request will be sent to the seller</li>
                <li>• The seller will confirm availability and share payment details</li>
                <li>• Complete payment outside the platform as instructed</li>
                <li>• Receive your tickets after payment confirmation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700">
            <CreditCard className="h-4 w-4 mr-2" />
            Confirm Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
