import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRating } from '@/components/shared/UserRating';

interface SellerInfoCardProps {
  ticket: {
    seller_id: string;
    profiles: {
      full_name: string;
      is_verified: boolean;
    };
  };
  sellerStats?: {
    rating: number;
    reviewCount: number;
    totalSold: number;
    totalListed: number;
    activeListed: number;
  } | null;
}

export const SellerInfoCard = ({ ticket, sellerStats }: SellerInfoCardProps) => {
  const navigate = useNavigate();

  const handleSellerClick = () => {
    navigate(`/seller/${ticket.seller_id}`);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
        
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <User className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <button 
                  onClick={handleSellerClick}
                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {ticket.profiles.full_name}
                </button>
                {ticket.profiles.is_verified && (
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <UserRating 
                  rating={sellerStats?.rating} 
                  reviewCount={sellerStats?.reviewCount || 0}
                  size="md"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p>{sellerStats?.totalSold || 0} tickets sold • {sellerStats?.activeListed || 1} Current listings</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
