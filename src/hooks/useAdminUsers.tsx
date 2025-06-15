
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Get user profiles with transaction statistics
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      // For each user, calculate their transaction statistics
      const usersWithStats = await Promise.all(
        profiles.map(async (profile) => {
          // Count tickets bought (as buyer)
          const { count: ticketsBought } = await supabase
            .from('tickets')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'sold');

          // Count tickets sold (as seller)
          const { count: ticketsSold } = await supabase
            .from('tickets')
            .select('*', { count: 'exact', head: true })
            .eq('seller_id', profile.id)
            .eq('status', 'sold');

          // Calculate total spent (sum of ticket prices bought)
          const { data: boughtTickets } = await supabase
            .from('tickets')
            .select('selling_price')
            .eq('status', 'sold');

          // Calculate total earned (sum of ticket prices sold)
          const { data: soldTickets } = await supabase
            .from('tickets')
            .select('selling_price')
            .eq('seller_id', profile.id)
            .eq('status', 'sold');

          const totalSpent = boughtTickets?.reduce((sum, ticket) => sum + Number(ticket.selling_price), 0) || 0;
          const totalEarned = soldTickets?.reduce((sum, ticket) => sum + Number(ticket.selling_price), 0) || 0;
          const totalTransactions = (ticketsBought || 0) + (ticketsSold || 0);

          return {
            ...profile,
            total_transactions: totalTransactions,
            total_spent: totalSpent,
            total_earned: totalEarned
          };
        })
      );

      return usersWithStats;
    },
  });
};
