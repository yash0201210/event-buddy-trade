
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Event, University, Venue } from '@/types/event';

export const useEventData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchEvents();
    fetchUniversities();
    fetchVenues();
  }, []);

  return {
    events,
    universities,
    venues,
    fetchEvents,
    fetchUniversities,
    fetchVenues
  };
};
