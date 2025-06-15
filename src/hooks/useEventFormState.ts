
import { useState } from 'react';
import { Event, EventFormData } from '@/types/event';

export const useEventFormState = () => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
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
  const [newTicketType, setNewTicketType] = useState('');

  const formatDateTimeLocal = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toISOString().slice(0, 16);
    } catch {
      return '';
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
      event_date: event.event_date ? formatDateTimeLocal(event.event_date) : '',
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
    editingEvent,
    showForm,
    formData,
    newTicketType,
    setFormData,
    setNewTicketType,
    setShowForm,
    resetForm,
    startEdit
  };
};
