
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface PurchasedTicket {
  id: string;
  ticket_id: string;
  status: 'pending' | 'confirmed' | 'completed';
  amount_paid: number;
  transaction_date: string;
  seller_confirmed: boolean;
  buyer_confirmed: boolean;
  ticket: {
    title: string;
    ticket_type: string;
    quantity: number;
    pdf_url?: string;
    events: {
      name: string;
      venue: string;
      city: string;
      event_date: string;
    };
  };
  seller: {
    full_name: string;
    is_verified: boolean;
  };
}

export const usePurchasedTickets = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['purchased-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching purchased tickets for user:', user.id);
      
      // Get conversations where user is buyer and has purchase requests
      const { data: conversations } = await supabase
        .from('conversations')
        .select(`
          id,
          ticket_id,
          status,
          created_at,
          messages!inner (
            message_type,
            content,
            created_at
          )
        `)
        .eq('buyer_id', user.id);

      if (!conversations) return [];

      // Filter conversations that have purchase requests and get ticket details
      const purchasedTickets = await Promise.all(
        conversations
          .filter(conv => conv.messages.some(msg => msg.message_type === 'purchase_request'))
          .map(async (conv) => {
            console.log('Processing conversation:', conv.id, 'for ticket:', conv.ticket_id);
            
            // Get ticket details including PDF URL
            const { data: ticket, error: ticketError } = await supabase
              .from('tickets')
              .select(`
                title,
                ticket_type,
                quantity,
                selling_price,
                pdf_url,
                events!tickets_event_id_fkey (
                  name,
                  venue,
                  city,
                  event_date
                ),
                profiles!tickets_seller_id_fkey (
                  full_name,
                  is_verified
                )
              `)
              .eq('id', conv.ticket_id)
              .single();

            if (ticketError) {
              console.error('Error fetching ticket:', ticketError);
              return null;
            }

            if (!ticket) {
              console.log('No ticket found for ID:', conv.ticket_id);
              return null;
            }

            console.log('Ticket data:', ticket);
            console.log('PDF URL for ticket:', ticket.pdf_url);

            // Determine status based on messages - improved logic
            const messages = conv.messages.sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            
            let status: 'pending' | 'confirmed' | 'completed' = 'pending';
            let buyerConfirmed = false;
            let sellerConfirmed = false;
            
            // Check each message type to determine the current status
            let hasOrderConfirmed = false;
            let hasTransferConfirmation = false;
            let hasFundsReceived = false;
            
            for (const msg of messages) {
              if (msg.message_type === 'order_confirmed') {
                hasOrderConfirmed = true;
              } else if (msg.message_type === 'transfer_confirmation') {
                hasTransferConfirmation = true;
                buyerConfirmed = true;
              } else if (msg.message_type === 'funds_received') {
                hasFundsReceived = true;
                sellerConfirmed = true;
              }
            }

            // Determine final status based on message progression
            if (hasFundsReceived && sellerConfirmed) {
              status = 'completed';
            } else if (hasOrderConfirmed) {
              status = 'confirmed';
            } else {
              status = 'pending';
            }

            console.log('Transaction status determination:', {
              conversationId: conv.id,
              hasOrderConfirmed,
              hasTransferConfirmation,
              hasFundsReceived,
              finalStatus: status,
              buyerConfirmed,
              sellerConfirmed
            });

            return {
              id: conv.id,
              ticket_id: conv.ticket_id,
              status,
              amount_paid: ticket.selling_price,
              transaction_date: conv.created_at,
              seller_confirmed: sellerConfirmed,
              buyer_confirmed: buyerConfirmed,
              ticket: {
                title: ticket.title,
                ticket_type: ticket.ticket_type,
                quantity: ticket.quantity,
                pdf_url: ticket.pdf_url,
                events: ticket.events,
              },
              seller: ticket.profiles,
            };
          })
      );

      const validTickets = purchasedTickets.filter(Boolean) as PurchasedTicket[];
      console.log('Final purchased tickets:', validTickets);
      return validTickets;
    },
    enabled: !!user,
  });
};
