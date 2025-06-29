
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
import { MapPin, Calendar, CreditCard, Shield, AlertTriangle } from 'lucide-react';

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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
          <DialogDescription>
            Review your order details before proceeding
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-gray-50">
          <CardContent className="p-3">
            <h3 className="font-semibold mb-2 text-sm">{ticket.events.name}</h3>
            
            <div className="space-y-1 text-xs text-gray-600 mb-3">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-2" />
                <span>{new Date(ticket.events.event_date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-2" />
                <span>{ticket.events.venue}, {ticket.events.city}</span>
              </div>
            </div>

            <div className="border-t pt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">{ticket.quantity} X {ticket.ticket_type}</span>
                <span className="font-semibold text-sm">£{ticket.selling_price}</span>
              </div>
              
              <div className="flex justify-between items-center font-semibold">
                <span className="text-sm">Confirmed Amount</span>
                <span className="text-lg">£{totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1 text-sm">How it works</h4>
              <ul className="text-xs text-blue-800 space-y-0.5">
                <li>• Your purchase request will be sent to the seller</li>
                <li>• The seller will confirm availability and share payment details</li>
                <li>• Complete payment outside the platform as instructed</li>
                <li>• Receive your tickets after payment confirmation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-orange-900 mb-1 text-sm">Important</h4>
              <p className="text-xs text-orange-800">
                Remember to confirm the transaction once completed. Failure to do so could result in a ban or fine.
              </p>
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
