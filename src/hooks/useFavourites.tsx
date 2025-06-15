
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Event } from '@/types/event';

export const useFavourites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: favouriteEvents = [], isLoading } = useQuery({
    queryKey: ['favourite-events', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

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
            venue_id
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favourite events:', error);
        return [];
      }

      return (data || []).map(item => item.events).filter(Boolean) as Event[];
    },
    enabled: !!user?.id,
  });

  const toggleFavouriteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      setIsUpdating(true);

      // Check if already favourite
      const { data: existing } = await supabase
        .from('user_event_favourites')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .single();

      if (existing) {
        // Remove from favourites
        const { error } = await supabase
          .from('user_event_favourites')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', eventId);

        if (error) throw error;
      } else {
        // Add to favourites
        const { error } = await supabase
          .from('user_event_favourites')
          .insert({
            user_id: user.id,
            event_id: eventId
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourite-events', user?.id] });
      setIsUpdating(false);
    },
    onError: () => {
      setIsUpdating(false);
    }
  });

  const toggleFavourite = (eventId: string) => {
    toggleFavouriteMutation.mutate(eventId);
  };

  const isFavourite = (eventId: string) => {
    return favouriteEvents.some(event => event.id === eventId);
  };

  return {
    favouriteEvents,
    isLoading,
    isUpdating,
    toggleFavourite,
    isFavourite,
  };
};
