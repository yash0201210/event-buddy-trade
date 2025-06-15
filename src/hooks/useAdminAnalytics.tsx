
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      // Get total tickets sold
      const { count: totalTicketsSold } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'sold');

      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total events
      const { count: totalEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      // Get tickets sold per city
      const { data: ticketsByCity } = await supabase
        .from('tickets')
        .select(`
          selling_price,
          events!inner(city)
        `)
        .eq('status', 'sold');

      // Get tickets sold per university
      const { data: ticketsByUniversity } = await supabase
        .from('tickets')
        .select(`
          selling_price,
          events!inner(
            universities(name)
          )
        `)
        .eq('status', 'sold');

      // Get all sold tickets for revenue calculation
      const { data: soldTickets } = await supabase
        .from('tickets')
        .select('selling_price')
        .eq('status', 'sold');

      // Get detailed transactions
      const { data: transactions } = await supabase
        .from('tickets')
        .select(`
          id,
          selling_price,
          ticket_type,
          status,
          sold_at,
          events(name),
          profiles!tickets_seller_id_fkey(email)
        `)
        .eq('status', 'sold')
        .order('sold_at', { ascending: false });

      // Calculate metrics
      const totalRevenue = soldTickets?.reduce((sum, ticket) => sum + Number(ticket.selling_price), 0) || 0;

      // Group tickets by city
      const cityStats = ticketsByCity?.reduce((acc: any, ticket: any) => {
        const city = ticket.events.city;
        if (!acc[city]) {
          acc[city] = { count: 0, revenue: 0 };
        }
        acc[city].count += 1;
        acc[city].revenue += Number(ticket.selling_price);
        return acc;
      }, {}) || {};

      // Group tickets by university
      const universityStats = ticketsByUniversity?.reduce((acc: any, ticket: any) => {
        const universityName = ticket.events?.universities?.name || 'Unknown';
        if (!acc[universityName]) {
          acc[universityName] = { count: 0, revenue: 0 };
        }
        acc[universityName].count += 1;
        acc[universityName].revenue += Number(ticket.selling_price);
        return acc;
      }, {}) || {};

      // Format transactions for display
      const formattedTransactions = transactions?.map(transaction => ({
        id: transaction.id,
        event_name: transaction.events?.name || 'Unknown Event',
        buyer_email: 'buyer@example.com', // This would need proper buyer tracking
        seller_email: transaction.profiles?.email || 'Unknown',
        amount: Number(transaction.selling_price),
        completed_at: transaction.sold_at || new Date().toISOString(),
        ticket_type: transaction.ticket_type,
        status: transaction.status
      })) || [];

      return {
        overview: {
          totalTicketsSold: totalTicketsSold || 0,
          totalUsers: totalUsers || 0,
          totalEvents: totalEvents || 0,
          totalRevenue
        },
        cityStats,
        universityStats,
        transactions: formattedTransactions
      };
    },
  });
};
