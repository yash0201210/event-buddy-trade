
import { useState } from 'react';
import { Event, EventFormData } from '@/types/event';

export const useEventFormState = () => {
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
    // Use functional update to ensure we're working with the latest state
    setFormData(currentFormData => {
      const updatedFormData = { ...currentFormData };
      
      // Only update fields that have meaningful values
      if (prefillData.name && prefillData.name.trim()) {
        updatedFormData.name = prefillData.name;
      }
      if (prefillData.venue && prefillData.venue.trim()) {
        updatedFormData.venue = prefillData.venue;
      }
      if (prefillData.city && prefillData.city.trim()) {
        updatedFormData.city = prefillData.city;
      }
      if (prefillData.start_date_time) {
        updatedFormData.start_date_time = prefillData.start_date_time;
      }
      if (prefillData.end_date_time) {
        updatedFormData.end_date_time = prefillData.end_date_time;
      }
      if (prefillData.category && prefillData.category.trim()) {
        updatedFormData.category = prefillData.category;
      }
      if (prefillData.description && prefillData.description.trim()) {
        updatedFormData.description = prefillData.description;
      }
      if (prefillData.image_url && prefillData.image_url.trim()) {
        updatedFormData.image_url = prefillData.image_url;
      }
      if (prefillData.ticket_types && Array.isArray(prefillData.ticket_types) && prefillData.ticket_types.length > 0) {
        updatedFormData.ticket_types = prefillData.ticket_types;
      }

      return updatedFormData;
    });

    if (prefillData.ticket_prices && prefillData.ticket_prices.length > 0) {
      console.log('Extracted ticket prices for reference:', prefillData.ticket_prices);
    }
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
    startEdit,
    prefillFormData
  };
};
