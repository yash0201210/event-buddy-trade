
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSellerStats } from '@/hooks/useSellerStats';

interface Ticket {
  id: string;
  title: string;
  ticket_type: string;
  quantity: number;
  selling_price: number;
  original_price: number;
  description?: string;
  is_negotiable: boolean;
  seller_id: string;
  profiles: {
    full_name: string;
  };
}

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: sellerStats } = useSellerStats(ticket.seller_id);

  const handleViewTicket = (ticketId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view tickets",
      });
      navigate('/auth');
      return;
    }
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <Card className="border-l-4 border-l-[#E8550D] bg-white shadow-sm">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-3 w-3 mr-1" />
                <span>{ticket.profiles?.full_name || 'Unknown'}</span>
              </div>
              <div className="flex items-center text-sm text-[#E8550D]">
                <Star className="h-3 w-3 mr-1 fill-current" />
                <span>{sellerStats?.rating || '0.0'}</span>
                <span className="ml-1 text-gray-500">({sellerStats?.totalSold || 0} sold)</span>
              </div>
              {ticket.is_negotiable && (
                <Badge className="bg-blue-100 text-blue-700 text-xs">
                  Negotiable
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                Quantity: {ticket.quantity}
              </p>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 mb-1">
                  £{ticket.selling_price}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  per ticket
                </div>
                <Button 
                  size="sm"
                  className="bg-[#E8550D] hover:bg-[#D44B0B] text-white h-7 px-3 text-xs"
                  onClick={() => handleViewTicket(ticket.id)}
                >
                  View
                </Button>
              </div>
            </div>
            
            {ticket.description && (
              <p className="text-gray-600 text-sm mt-1">
                {ticket.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
