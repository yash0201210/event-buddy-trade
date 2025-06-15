import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
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
    event_date: '',
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
          event_date: prefillData.event_date || '',
          category: prefillData.category || 'concerts',
          description: prefillData.description || '',
          image_url: prefillData.image_url || '',
          ticket_types: prefillData.ticket_types || []
        }));
        
        toast({
          title: "Event details pre-filled",
          description: "Event information has been automatically extracted from the submitted URL.",
        });
      }
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          universities(name),
          venues(name, city)
        `)
        .order('event_date', { ascending: true });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        university_id: formData.university_id === 'none' ? null : formData.university_id || null,
        venue_id: formData.venue_id === 'none' ? null : formData.venue_id || null
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
      event_date: '',
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
      event_date: event.event_date,
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
