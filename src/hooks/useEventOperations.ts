
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Event, EventFormData, Venue } from '@/types/event';
import { useVenueCreation } from './useVenueCreation';

export const useEventOperations = (
  venues: Venue[],
  onSuccess: () => void
) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { createVenueIfNotExists } = useVenueCreation(venues);

  const handleSubmit = async (e: React.FormEvent, formData: EventFormData, editingEvent: Event | null) => {
    e.preventDefault();
    setLoading(true);

    try {
      let venueId = formData.venue_id === 'none' ? null : formData.venue_id || null;
      
      if (!venueId && formData.venue && formData.city) {
        venueId = await createVenueIfNotExists(formData.venue, formData.city);
      }

      const eventData = {
        name: formData.name,
        venue: formData.venue,
        city: formData.city,
        start_date_time: formData.start_date_time ? new Date(formData.start_date_time).toISOString() : null,
        end_date_time: formData.end_date_time ? new Date(formData.end_date_time).toISOString() : null,
        category: formData.category,
        description: formData.description || null,
        image_url: formData.image_url || null,
        ticket_types: formData.ticket_types,
        university_id: formData.university_id === 'none' ? null : formData.university_id || null,
        venue_id: venueId
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        
        toast({
          title: "Event updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from('events')
          .insert(eventData);

        if (error) throw error;
        
        toast({
          title: "Event created successfully!",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      
      toast({
        title: "Event deleted successfully!",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive"
      });
    }
  };

  return {
    loading,
    handleSubmit,
    handleDelete
  };
};
