import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  start_date_time: string;
  end_date_time: string;
  category: string;
  description?: string;
  image_url?: string;
  ticket_types?: string[];
  university_id?: string;
  venue_id?: string;
}

interface University {
  id: string;
  name: string;
}

interface Venue {
  id: string;
  name: string;
  city: string;
  address?: string;
}

export const useAdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    city: '',
    start_date_time: '',
    end_date_time: '',
    category: '',
    description: '',
    image_url: '',
    ticket_types: [] as string[],
    university_id: '',
    venue_id: ''
  });
  const [newTicketType, setNewTicketType] = useState('');
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchUniversities();
    fetchVenues();

    if (location.state?.autoOpenForm) {
      setShowForm(true);
      
      if (location.state.prefillData) {
        const prefillData = location.state.prefillData;
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
        
        toast({
          title: "Event details pre-filled",
          description: "Event information has been automatically extracted from the submitted URL.",
        });

        // Log ticket prices for admin reference
        if (prefillData.ticket_prices && prefillData.ticket_prices.length > 0) {
          console.log('Extracted ticket prices for reference:', prefillData.ticket_prices);
        }
      }
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

  const formatDateTimeLocal = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      // Format to YYYY-MM-DDTHH:MM for datetime-local input
      return date.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          universities(name),
          venues(name, city)
        `)
        .order('start_date_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive"
      });
    }
  };

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setUniversities(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch universities",
        variant: "destructive"
      });
    }
  };

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('id, name, city')
        .order('name');

      if (error) throw error;
      setVenues(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch venues",
        variant: "destructive"
      });
    }
  };

  const createVenueIfNotExists = async (venueName: string, city: string, address?: string): Promise<string | null> => {
    // Check if venue already exists
    const existingVenue = venues.find(v => 
      v.name.toLowerCase() === venueName.toLowerCase() && 
      v.city.toLowerCase() === city.toLowerCase()
    );
    
    if (existingVenue) {
      return existingVenue.id;
    }

    // Create new venue
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
      
      // Refresh venues list
      await fetchVenues();
      
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
      
      // If no venue is selected from dropdown but venue name is provided, create new venue
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
      fetchEvents();
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
      
      fetchEvents();
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

  return {
    events,
    universities,
    venues,
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
    startEdit
  };
};
