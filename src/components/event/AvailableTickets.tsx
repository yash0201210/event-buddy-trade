
import React, { useState } from 'react';
import { TicketTypeHeader } from './TicketTypeHeader';
import { TicketCard } from './TicketCard';

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
    avatar_url?: string;
    is_verified: boolean;
  };
}

interface TicketGroup {
  type: string;
  tickets: Ticket[];
  minPrice: number;
  totalQuantity: number;
}

interface AvailableTicketsProps {
  tickets: any[];
  isLoading: boolean;
}

export const AvailableTickets = ({ tickets, isLoading }: AvailableTicketsProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (type: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedGroups(newExpanded);
  };

  // Transform tickets to match expected structure
  const transformedTickets = tickets.map(ticket => ({
    ...ticket,
    profiles: {
      full_name: ticket.profiles?.full_name || 'Unknown Seller',
      avatar_url: ticket.profiles?.avatar_url || '',
      is_verified: ticket.profiles?.is_verified || false
    }
  }));

  // Group tickets by type
  const ticketGroups: TicketGroup[] = transformedTickets.reduce((groups, ticket) => {
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

  const handleViewDetails = (ticketId: string) => {
    window.location.href = `/ticket/${ticketId}`;
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Tickets</h2>
      
      <div className="space-y-3">
        {ticketGroups.map((group) => (
          <div key={group.type}>
            <TicketTypeHeader
              group={group}
              isExpanded={expandedGroups.has(group.type)}
              onToggle={() => toggleGroup(group.type)}
            />

            {expandedGroups.has(group.type) && (
              <div className="ml-4 mt-2 space-y-2">
                {group.tickets.map((ticket) => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket} 
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
