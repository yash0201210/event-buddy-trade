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
export const TicketCard = ({
  ticket
}: TicketCardProps) => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    data: sellerStats
  } = useSellerStats(ticket.seller_id);
  const handleViewTicket = (ticketId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view tickets"
      });
      navigate('/auth');
      return;
    }
    navigate(`/ticket/${ticketId}`);
  };
  return <Card className="border-l-4 border-l-primary bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Seller Info Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">{ticket.profiles?.full_name || 'Unknown'}</span>
              </div>
              <div className="flex items-center text-sm text-primary">
                <Star className="h-4 w-4 mr-1 fill-current" />
                <span className="font-semibold">{sellerStats?.rating || '0.0'}</span>
                <span className="ml-1 text-muted-foreground">({sellerStats?.totalSold || 0} sold)</span>
              </div>
            </div>
            {ticket.is_negotiable && <Badge variant="secondary" className="text-xs">
                Negotiable
              </Badge>}
          </div>
          
          {/* Main Content Section */}
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <p className="text-sm text-muted-foreground mb-2 text-left">
                <span className="font-medium">Quantity:</span> {ticket.quantity}
              </p>
              
              {ticket.description && <p className="text-sm text-muted-foreground leading-relaxed">
                  {ticket.description}
                </p>}
            </div>
            
            {/* Price and Action Section */}
            <div className="text-right space-y-2">
              <div>
                <div className="text-xl font-bold text-foreground">
                  £{ticket.selling_price}
                </div>
                <div className="text-xs text-muted-foreground">
                  per ticket
                </div>
              </div>
              <Button size="sm" className="w-full min-w-[80px]" onClick={() => handleViewTicket(ticket.id)}>
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};