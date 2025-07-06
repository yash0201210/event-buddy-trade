import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { VerifiedMark } from '@/components/shared/VerifiedMark';
import { useSellerStats } from '@/hooks/useSellerStats';
import { UserRating } from '@/components/shared/UserRating';
import { useBuyerStats } from '@/hooks/useBuyerStats';

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    selling_price: number;
    ticket_type: string;
    seller_id: string;
    profiles: {
      full_name: string;
      avatar_url: string;
      is_verified: boolean;
    } | null;
  };
  onViewDetails: (ticketId: string) => void;
}

export const TicketCard = ({ ticket, onViewDetails }: TicketCardProps) => {
  const sellerId = ticket.seller_id;
  const sellerStats = useSellerStats(sellerId);

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails(ticket.id)}>
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Avatar className="mr-3 h-8 w-8">
            <AvatarImage src={ticket.profiles?.avatar_url || ''} alt={ticket.profiles?.full_name || 'Seller'} />
            <AvatarFallback>{ticket.profiles?.full_name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <span className="font-semibold text-sm">{ticket.profiles?.full_name || 'Unknown Seller'}</span>
              {ticket.profiles?.is_verified && <VerifiedMark />}
            </div>
            <p className="text-xs text-gray-500">Verified Seller</p>
          </div>
        </div>
        <h3 className="font-bold text-lg mb-2">{ticket.title}</h3>
        <p className="text-gray-600 text-sm mb-3">
          {ticket.ticket_type}
        </p>
        <div className="flex items-center justify-between">
          <UserRating 
            rating={sellerStats?.rating || 4.0} 
            reviewCount={sellerStats?.reviewCount || 1}
            size="sm"
          />
          <span className="text-sm text-gray-500">
            {sellerStats?.totalSold || 0} sold
          </span>
        </div>
        <div className="mt-4">
          <span className="text-xl font-semibold">£{ticket.selling_price}</span>
        </div>
      </CardContent>
    </Card>
  );
};
