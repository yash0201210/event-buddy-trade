
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSellerStats = (sellerId?: string) => {
  return useQuery({
    queryKey: ['seller-stats', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      
      const { count: totalSold } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', sellerId)
        .eq('status', 'sold');

      const { count: totalListed } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', sellerId);

      return {
        totalSold: totalSold || 0,
        totalListed: totalListed || 0,
        rating: 4.8, // Mock rating - in a real app this would come from reviews
        reviewCount: Math.max(1, Math.floor((totalSold || 0) * 0.8)) // Mock review count
      };
    },
    enabled: !!sellerId,
  });
};
