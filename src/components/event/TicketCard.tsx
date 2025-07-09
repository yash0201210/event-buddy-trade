
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { VerifiedMark } from '@/components/shared/VerifiedMark';
import { useSellerStats } from '@/hooks/useSellerStats';
import { UserRating } from '@/components/shared/UserRating';

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    selling_price: number;
    ticket_type: string;
    seller_id: string;
    profiles: {
      full_name: string;
      avatar_url?: string;
      is_verified: boolean;
    } | null;
  };
  onViewDetails: (ticketId: string) => void;
}

export const TicketCard = ({ ticket, onViewDetails }: TicketCardProps) => {
  const sellerId = ticket.seller_id;
  const { data: sellerStats } = useSellerStats(sellerId);

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails(ticket.id)}>
      <CardContent className="p-3">
        <div className="flex items-center mb-2">
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src={ticket.profiles?.avatar_url || ''} alt={ticket.profiles?.full_name || 'Seller'} />
            <AvatarFallback className="text-xs">{ticket.profiles?.full_name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="font-medium text-xs">{ticket.profiles?.full_name || 'Unknown Seller'}</span>
              {ticket.profiles?.is_verified && <VerifiedMark />}
            </div>
            <p className="text-xs text-gray-500">Verified Seller</p>
          </div>
        </div>
        <h3 className="font-semibold text-base mb-1">{ticket.title}</h3>
        <p className="text-gray-600 text-xs mb-2">
          {ticket.ticket_type}
        </p>
        <div className="flex items-center justify-between mb-2">
          <UserRating 
            rating={sellerStats?.rating} 
            reviewCount={sellerStats?.reviewCount || 0}
            size="sm"
          />
          <span className="text-xs text-gray-500">
            {sellerStats?.totalSold || 0} sold
          </span>
        </div>
        <div className="mt-2">
          <span className="text-lg font-semibold">£{ticket.selling_price}</span>
        </div>
      </CardContent>
    </Card>
  );
};
