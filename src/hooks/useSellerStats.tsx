
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSellerStats = (sellerId?: string) => {
  return useQuery({
    queryKey: ['seller-stats', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      
      console.log('Fetching seller stats for:', sellerId);
      
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

      const soldCount = totalSold || 0;
      const activeCount = activeListed || 0;
      const totalCount = totalListed || 1;
      
      console.log('Seller stats:', { soldCount, activeCount, totalCount });
      
      // More realistic rating calculation
      let rating = 4.0; // Base rating for new sellers
      
      if (soldCount > 0) {
        // Calculate rating based on sales activity and success
        const salesRatio = soldCount / Math.max(totalCount, 1);
        const activityBonus = Math.min(soldCount / 10, 1); // Bonus for more sales
        
        // Rating between 3.5 and 5.0 based on performance
        rating = 3.5 + (salesRatio + activityBonus) * 0.75;
        rating = Math.min(5.0, Math.max(3.5, rating));
      } else if (totalCount > 5) {
        // Penalize sellers with many unsold tickets
        rating = 3.7;
      }
      
      // Round to 1 decimal place
      rating = Math.round(rating * 10) / 10;

      return {
        totalSold: soldCount,
        totalListed: totalCount,
        activeListed: activeCount,
        rating: rating,
        reviewCount: Math.max(1, Math.floor(soldCount * 0.8) + Math.floor(Math.random() * 3))
      };
    },
    enabled: !!sellerId,
  });
};
