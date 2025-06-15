
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

export const useFavourites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's favourite events
  const { data: favourites = [], isLoading } = useQuery({
    queryKey: ['user-favourites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_event_favourites')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(fav => fav.event_id);
    },
    enabled: !!user,
  });

  // Add to favourites mutation
  const addToFavouritesMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_event_favourites')
        .insert({ user_id: user.id, event_id: eventId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favourites'] });
      toast({
        title: "Added to favourites",
        description: "Event has been added to your favourites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add event to favourites",
        variant: "destructive",
      });
    },
  });

  // Remove from favourites mutation
  const removeFromFavouritesMutation = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_event_favourites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favourites'] });
      toast({
        title: "Removed from favourites",
        description: "Event has been removed from your favourites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove event from favourites",
        variant: "destructive",
      });
    },
  });

  const toggleFavourite = (eventId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add events to favourites",
        variant: "destructive",
      });
      return;
    }

    const isFavourite = favourites.includes(eventId);
    
    if (isFavourite) {
      removeFromFavouritesMutation.mutate(eventId);
    } else {
      addToFavouritesMutation.mutate(eventId);
    }
  };

  const isFavourite = (eventId: string) => favourites.includes(eventId);

  return {
    favourites,
    isLoading,
    toggleFavourite,
    isFavourite,
    isUpdating: addToFavouritesMutation.isPending || removeFromFavouritesMutation.isPending,
  };
};
