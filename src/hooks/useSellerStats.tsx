
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSellerStats = (sellerId?: string) => {
  return useQuery({
    queryKey: ['seller-stats', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      
      // Get total sold tickets count
      const { count: totalSold } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', sellerId)
        .eq('status', 'sold');

      // Get total listed tickets count (including sold ones)
      const { count: totalListed } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', sellerId);

      // Get active listings count
      const { count: activeListed } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', sellerId)
        .eq('status', 'available');

      // Calculate a basic rating based on sales success rate
      const soldCount = totalSold || 0;
      const activeCount = activeListed || 0;
      const totalCount = totalListed || 1;
      
      // Base rating calculation: higher sales success = higher rating
      const successRate = soldCount / Math.max(totalCount, 1);
      const baseRating = 3.5 + (successRate * 1.5); // Range: 3.5-5.0
      const rating = Math.min(5.0, Math.max(3.5, baseRating));
      
      // Review count is based on sold tickets (assuming some buyers leave reviews)
      const reviewCount = Math.max(1, Math.floor(soldCount * 0.7));

      return {
        totalSold: soldCount,
        totalListed: totalCount,
        activeListed: activeCount,
        rating: Number(rating.toFixed(1)),
        reviewCount: reviewCount
      };
    },
    enabled: !!sellerId,
  });
};
