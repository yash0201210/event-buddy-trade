
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { PurchasedTicket } from '@/hooks/usePurchasedTickets';

interface TransactionStatusCardProps {
  ticket: PurchasedTicket;
}

export const TransactionStatusCard = ({ ticket }: TransactionStatusCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Transaction Status
          <Badge 
            variant={ticket.status === 'completed' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {ticket.status === 'completed' ? 'Completed' : 
             ticket.buyer_confirmed ? 'Awaiting Seller Confirmation' : 
             'Payment Pending'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm">Purchase Request Sent</span>
          <div className="flex items-center text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
            Complete
          </div>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm">Seller Accepted</span>
          <div className="flex items-center text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
            Complete
          </div>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span className="text-sm">Payment Transferred</span>
          <div className="flex items-center text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
            Complete
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm">Seller Confirms Receipt</span>
          <div className="flex items-center text-yellow-600">
            <Clock className="w-4 h-4 mr-2" />
            {ticket.seller_confirmed ? 'Complete' : 'Pending'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
