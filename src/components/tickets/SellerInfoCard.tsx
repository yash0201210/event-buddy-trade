
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Star } from 'lucide-react';

interface SellerInfoCardProps {
  ticket: {
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
  } | null;
}

export const SellerInfoCard = ({ ticket, sellerStats }: SellerInfoCardProps) => {
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
                <p className="font-semibold">{ticket.profiles.full_name}</p>
                {ticket.profiles.is_verified && (
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{sellerStats?.rating || 4.8}</span>
                  <span className="ml-1">({sellerStats?.reviewCount || 1} reviews)</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>{sellerStats?.totalSold || 0} tickets sold • {sellerStats?.totalListed || 1} total listings</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
