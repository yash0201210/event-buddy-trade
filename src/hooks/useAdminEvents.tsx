
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useEventData } from './useEventData';
import { useEventForm } from './useEventForm';

export const useAdminEvents = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { events, universities, venues, fetchEvents, fetchUniversities, fetchVenues } = useEventData();
  
  const {
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
  } = useEventForm(venues, () => {
    fetchEvents();
    fetchVenues();
  });

  useEffect(() => {
    if (location.state?.autoOpenForm) {
      setShowForm(true);
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast, setShowForm]);

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
