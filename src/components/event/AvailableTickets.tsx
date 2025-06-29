
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Ticket {
  id: string;
  title: string;
  ticket_type: string;
  quantity: number;
  selling_price: number;
  original_price: number;
  description?: string;
  is_negotiable: boolean;
  profiles: {
    full_name: string;
  };
}

interface TicketGroup {
  type: string;
  tickets: Ticket[];
  minPrice: number;
  totalQuantity: number;
}

interface AvailableTicketsProps {
  tickets: Ticket[];
  isLoading: boolean;
}

export const AvailableTickets = ({ tickets, isLoading }: AvailableTicketsProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const toggleGroup = (type: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedGroups(newExpanded);
  };

  // Group tickets by type
  const ticketGroups: TicketGroup[] = tickets.reduce((groups, ticket) => {
    const existingGroup = groups.find(g => g.type === ticket.ticket_type);
    if (existingGroup) {
      existingGroup.tickets.push(ticket);
      existingGroup.minPrice = Math.min(existingGroup.minPrice, ticket.selling_price);
      existingGroup.totalQuantity += ticket.quantity;
    } else {
      groups.push({
        type: ticket.ticket_type,
        tickets: [ticket],
        minPrice: ticket.selling_price,
        totalQuantity: ticket.quantity
      });
    }
    return groups;
  }, [] as TicketGroup[]);

  if (isLoading) {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Tickets</h2>
        <div className="text-center py-8">Loading tickets...</div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Tickets</h2>
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600 mb-4">No tickets available for this event</p>
          <p className="text-sm text-gray-500">Check back later for new listings!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Tickets</h2>
      
      <div className="space-y-3">
        {ticketGroups.map((group) => (
          <div key={group.type}>
            {/* Ticket Type Header - Improved UI */}
            <Card className="hover:shadow-md transition-shadow border border-gray-200">
              <CardContent className="p-0">
                <div 
                  className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => toggleGroup(group.type)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {group.type}
                      </h3>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          From £{group.minPrice}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs bg-gray-100">
                          {group.totalQuantity} available
                        </Badge>
                      </div>
                      {expandedGroups.has(group.type) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Tickets */}
            {expandedGroups.has(group.type) && (
              <div className="ml-4 mt-2 space-y-2">
                {group.tickets.map((ticket) => (
                  <Card key={ticket.id} className="border-l-4 border-l-[#E8550D] bg-white shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="h-3 w-3 mr-1" />
                              <span>{ticket.profiles?.full_name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center text-sm text-[#E8550D]">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              <span>4.8</span>
                              <span className="ml-1 text-gray-500">(23 sold)</span>
                            </div>
                            {ticket.is_negotiable && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                Negotiable
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-1 text-sm">
                            Quantity: {ticket.quantity}
                          </p>
                          
                          {ticket.description && (
                            <p className="text-gray-600 text-sm">
                              {ticket.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900 mb-2">
                            £{ticket.selling_price}
                          </div>
                          <div className="text-sm text-gray-500 mb-3">
                            per ticket
                          </div>
                          <Button 
                            size="sm"
                            className="bg-[#E8550D] hover:bg-[#D44B0B] text-white"
                            onClick={() => handleViewTicket(ticket.id)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
