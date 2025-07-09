
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Shield, Star, Calendar, MapPin } from 'lucide-react';
import { useSellerStats } from '@/hooks/useSellerStats';
import { UserRating } from '@/components/shared/UserRating';

interface SellerProfile {
  id: string;
  full_name: string;
  is_verified: boolean;
  created_at: string;
}

interface SellerTicket {
  id: string;
  title: string;
  ticket_type: string;
  quantity: number;
  selling_price: number;
  status: string;
  created_at: string;
  events: {
    name: string;
    venue: string;
    city: string;
    event_date: string;
  };
}

const SellerProfile = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();

  const { data: seller, isLoading: sellerLoading } = useQuery({
    queryKey: ['seller-profile', sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, is_verified, created_at')
        .eq('id', sellerId)
        .single();

      if (error) throw error;
      return data as SellerProfile;
    },
    enabled: !!sellerId,
  });

  const { data: sellerStats } = useSellerStats(sellerId);

  const { data: sellerTickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['seller-tickets', sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          id,
          title,
          ticket_type,
          quantity,
          selling_price,
          status,
          created_at,
          events!tickets_event_id_fkey (
            name,
            venue,
            city,
            event_date
          )
        `)
        .eq('seller_id', sellerId)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SellerTicket[];
    },
    enabled: !!sellerId,
  });

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading seller profile...</div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Seller not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-start mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Seller Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-red-600" />
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="text-xl font-semibold">{seller.full_name}</h1>
                  {seller.is_verified && (
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                  <UserRating 
                    rating={sellerStats?.rating} 
                    reviewCount={sellerStats?.reviewCount || 0}
                    size="md"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{sellerStats?.totalSold || 0}</p>
                    <p className="text-sm text-gray-600">Tickets Sold</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{sellerStats?.activeListed || 0}</p>
                    <p className="text-sm text-gray-600">Active Listings</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  Member since {new Date(seller.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Current Listings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Current Listings</CardTitle>
              </CardHeader>
              <CardContent>
                {ticketsLoading ? (
                  <div className="text-center py-8">Loading listings...</div>
                ) : !sellerTickets || sellerTickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No active listings at the moment
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sellerTickets.map((ticket) => (
                      <Card key={ticket.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{ticket.events.name}</h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{ticket.events.venue}, {ticket.events.city}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>{new Date(ticket.events.event_date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <span className="text-sm text-gray-600">
                                  {ticket.quantity} x {ticket.ticket_type}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900">
                                £{ticket.selling_price}
                              </div>
                              <div className="text-sm text-gray-500 mb-2">
                                per ticket
                              </div>
                              <Button 
                                size="sm"
                                className="bg-[#E8550D] hover:bg-[#D44B0B] text-white"
                                onClick={() => navigate(`/ticket/${ticket.id}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerProfile;
