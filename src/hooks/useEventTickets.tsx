
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEventTickets = (eventId?: string) => {
  return useQuery({
    queryKey: ['event-tickets', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      
      console.log('Fetching tickets for event:', eventId);
      
      // First get all tickets for the event
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select(`
          *,
          profiles!tickets_seller_id_fkey (
            full_name,
            is_verified
          )
        `)
        .eq('event_id', eventId)
        .eq('status', 'available')
        .order('selling_price', { ascending: true });

      if (error) {
        console.error('Error fetching event tickets:', error);
        throw error;
      }

      if (!tickets || tickets.length === 0) {
        console.log('No tickets found for event:', eventId);
        return [];
      }

      // Get all conversations for these tickets to check if any have been confirmed
      const ticketIds = tickets.map(ticket => ticket.id);
      const { data: conversations } = await supabase
        .from('conversations')
        .select(`
          id,
          ticket_id,
          messages!inner (
            message_type,
            created_at
          )
        `)
        .in('ticket_id', ticketIds);

      console.log('Found conversations:', conversations);

      // Create a set of ticket IDs that have been confirmed (order_confirmed message exists)
      const confirmedTicketIds = new Set();
      
      if (conversations) {
        conversations.forEach(conv => {
          const hasOrderConfirmed = conv.messages.some(msg => msg.message_type === 'order_confirmed');
          if (hasOrderConfirmed) {
            confirmedTicketIds.add(conv.ticket_id);
            console.log('Ticket marked as confirmed:', conv.ticket_id);
          }
        });
      }

      // Filter out tickets that have been confirmed by sellers
      const availableTickets = tickets.filter(ticket => {
        const isConfirmed = confirmedTicketIds.has(ticket.id);
        if (isConfirmed) {
          console.log('Removing confirmed ticket from available list:', ticket.id);
        }
        return !isConfirmed;
      });

      console.log('Final available tickets:', availableTickets.length, 'of', tickets.length);
      return availableTickets;
    },
    enabled: !!eventId,
  });
};
