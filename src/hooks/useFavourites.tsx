
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Event } from '@/types/event';

export const useFavourites = () => {
  const { user } = useAuth();
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());

  // Fetch user's favourite events
  const { data: favourites = [], isLoading } = useQuery({
    queryKey: ['favourites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_event_favourites')
        .select(`
          event_id,
          events (
            id,
            name,
            venue,
            city,
            start_date_time,
            end_date_time,
            category,
            description,
            image_url,
            ticket_types,
            university_id,
            venue_id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favourites:', error);
        return [];
      }

      return (data || []).map(item => item.events).filter(Boolean) as Event[];
    },
    enabled: !!user,
  });

  // Update local state when favourites are loaded
  useEffect(() => {
    const ids = new Set(favourites.map(event => event.id));
    setFavouriteIds(ids);
  }, [favourites]);

  const isFavourite = (eventId: string) => {
    return favouriteIds.has(eventId);
  };

  const toggleFavourite = async (eventId: string) => {
    if (!user) return;

    const isCurrentlyFavourite = favouriteIds.has(eventId);

    if (isCurrentlyFavourite) {
      // Remove from favourites
      const { error } = await supabase
        .from('user_event_favourites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (!error) {
        setFavouriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
      }
    } else {
      // Add to favourites
      const { error } = await supabase
        .from('user_event_favourites')
        .insert({
          user_id: user.id,
          event_id: eventId
        });

      if (!error) {
        setFavouriteIds(prev => {
          const newSet = new Set(prev);
          newSet.add(eventId);
          return newSet;
        });
      }
    }
  };

  return {
    favourites,
    isLoading,
    isFavourite,
    toggleFavourite
  };
};
