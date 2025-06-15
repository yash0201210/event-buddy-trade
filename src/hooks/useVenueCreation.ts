
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Venue } from '@/types/event';

export const useVenueCreation = (venues: Venue[]) => {
  const { toast } = useToast();

  const createVenueIfNotExists = async (venueName: string, city: string, address?: string): Promise<string | null> => {
    const existingVenue = venues.find(v => 
      v.name.toLowerCase() === venueName.toLowerCase() && 
      v.city.toLowerCase() === city.toLowerCase()
    );
    
    if (existingVenue) {
      return existingVenue.id;
    }

    try {
      const { data, error } = await supabase
        .from('venues')
        .insert({
          name: venueName,
          city: city,
          address: address || null
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "New venue created",
        description: `${venueName} has been added to the venues list.`,
      });
      
      return data.id;
    } catch (error: any) {
      console.error('Error creating venue:', error);
      return null;
    }
  };

  return { createVenueIfNotExists };
};
