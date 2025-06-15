
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Event, Venue, EventFormData } from '@/types/event';

export const useEventForm = (
  venues: Venue[],
  onSuccess: () => void
) => {
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    venue: '',
    city: '',
    start_date_time: '',
    end_date_time: '',
    category: '',
    description: '',
    image_url: '',
    ticket_types: [],
    university_id: '',
    venue_id: ''
  });
  const [newTicketType, setNewTicketType] = useState('');
  const { toast } = useToast();

  const formatDateTimeLocal = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
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

      resetForm();
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

  const resetForm = () => {
    setFormData({
      name: '',
      venue: '',
      city: '',
      start_date_time: '',
      end_date_time: '',
      category: '',
      description: '',
      image_url: '',
      ticket_types: [],
      university_id: '',
      venue_id: ''
    });
    setEditingEvent(null);
    setShowForm(false);
    setNewTicketType('');
  };

  const startEdit = (event: Event) => {
    setFormData({
      name: event.name,
      venue: event.venue,
      city: event.city,
      start_date_time: event.start_date_time ? formatDateTimeLocal(event.start_date_time) : '',
      end_date_time: event.end_date_time ? formatDateTimeLocal(event.end_date_time) : '',
      category: event.category,
      description: event.description || '',
      image_url: event.image_url || '',
      ticket_types: event.ticket_types || [],
      university_id: event.university_id || 'none',
      venue_id: event.venue_id || 'none'
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const prefillFormData = (prefillData: any) => {
    setFormData(prevData => ({
      ...prevData,
      name: prefillData.name || '',
      venue: prefillData.venue || '',
      city: prefillData.city || '',
      start_date_time: prefillData.start_date_time ? formatDateTimeLocal(prefillData.start_date_time) : '',
      end_date_time: prefillData.end_date_time ? formatDateTimeLocal(prefillData.end_date_time) : '',
      category: prefillData.category || 'concerts',
      description: prefillData.description || '',
      image_url: prefillData.image_url || '',
      ticket_types: prefillData.ticket_types || []
    }));

    if (prefillData.ticket_prices && prefillData.ticket_prices.length > 0) {
      console.log('Extracted ticket prices for reference:', prefillData.ticket_prices);
    }
  };

  return {
    loading,
    editingEvent,
    showForm,
    formData,
    newTicketType,
    setFormData,
    setNewTicketType,
    setShowForm,
    handleSubmit,
    handleDelete,
    resetForm,
    startEdit,
    prefillFormData
  };
};
