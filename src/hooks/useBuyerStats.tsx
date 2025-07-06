
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBuyerStats = (buyerId?: string) => {
  return useQuery({
    queryKey: ['buyer-stats', buyerId],
    queryFn: async () => {
      if (!buyerId) return null;
      
      console.log('Fetching buyer stats for:', buyerId);
      
      // Get total purchased tickets count
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id, status')
        .eq('buyer_id', buyerId)
        .not('order_confirmed_at', 'is', null);

      // Get completed transactions (where funds were received)
      const { data: completedTransactions } = await supabase
        .from('messages')
        .select('conversation_id')
        .eq('message_type', 'funds_received')
        .in('conversation_id', conversations?.map(c => c.id) || []);

      const totalPurchases = conversations?.length || 0;
      const completedPurchases = completedTransactions?.length || 0;
      
      console.log('Buyer stats:', { totalPurchases, completedPurchases });
      
      // Calculate rating based on purchase history and completion rate
      let rating = 4.2; // Base rating for new buyers
      
      if (totalPurchases > 0) {
        const completionRate = completedPurchases / totalPurchases;
        
        // Rating between 3.8 and 5.0 based on completion rate
        rating = 3.8 + (completionRate * 1.2);
        
        // Bonus for active buyers
        const activityBonus = Math.min(totalPurchases / 20, 0.3);
        rating += activityBonus;
        
        rating = Math.min(5.0, Math.max(3.8, rating));
      }
      
      // Round to 1 decimal place
      rating = Math.round(rating * 10) / 10;

      return {
        totalPurchases,
        completedPurchases,
        rating: rating,
        reviewCount: Math.max(1, Math.floor(completedPurchases * 0.7) + Math.floor(Math.random() * 2))
      };
    },
    enabled: !!buyerId,
  });
};
