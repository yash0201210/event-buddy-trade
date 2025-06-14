
import { HeroSection } from "@/components/home/HeroSection";
import { EventCategories } from "@/components/home/EventCategories";
import { SuggestedEvents } from "@/components/home/SuggestedEvents";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface TicketWithEvent {
  id: string;
  title: string;
  selling_price: number;
  original_price: number;
  quantity: number;
  section: string;
  row_number: string;
  is_negotiable: boolean;
  events: {
    name: string;
    venue: string;
    city: string;
    event_date: string;
    category: string;
  };
  profiles: {
    full_name: string;
    is_verified: boolean;
  };
}

const Index = () => {
  const navigate = useNavigate();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['available-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          events!tickets_event_id_fkey (
            name,
            venue,
            city,
            event_date,
            category
          ),
          profiles!tickets_seller_id_fkey (
            full_name,
            is_verified
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as TicketWithEvent[];
    },
  });

  const handleTicketClick = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <EventCategories />
      
      {/* Featured Tickets Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tickets</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover amazing deals on tickets from verified sellers
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => {
                const savings = ticket.original_price - ticket.selling_price;
                const savingsPercentage = Math.round((savings / ticket.original_price) * 100);
                
                return (
                  <Card 
                    key={ticket.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleTicketClick(ticket.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {ticket.events.name}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{ticket.events.venue}, {ticket.events.city}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(ticket.events.event_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        {savings > 0 && (
                          <Badge className="bg-green-100 text-green-700 ml-2">
                            {savingsPercentage}% off
                          </Badge>
                        )}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            {ticket.section} • Row {ticket.row_number}
                          </span>
                          {ticket.profiles.is_verified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900">
                                £{ticket.selling_price}
                              </span>
                              {savings > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                  £{ticket.original_price}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              per ticket • {ticket.quantity} available
                            </span>
                          </div>
                          
                          {ticket.is_negotiable && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Negotiable
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {tickets.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No tickets available at the moment</p>
              <Button onClick={() => navigate('/sell-tickets')} className="bg-red-600 hover:bg-red-700">
                List Your Tickets
              </Button>
            </div>
          )}
        </div>
      </section>

      <SuggestedEvents />
    </div>
  );
};

export default Index;
