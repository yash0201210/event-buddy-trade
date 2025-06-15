
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEventTickets = (eventId?: string) => {
  return useQuery({
    queryKey: ['event-tickets', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          profiles!tickets_seller_id_fkey (
            full_name,
            is_verified
          )
        `)
        .eq('event_id', eventId)
        .eq('status', 'available') // Only show available tickets
        .order('selling_price', { ascending: true });

      if (error) {
        console.error('Error fetching event tickets:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!eventId,
  });
};
