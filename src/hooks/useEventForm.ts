
import { Venue } from '@/types/event';
import { useEventFormState } from './useEventFormState';
import { useEventOperations } from './useEventOperations';

export const useEventForm = (
  venues: Venue[],
  onSuccess: () => void
) => {
  const {
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
  } = useEventFormState();

  const {
    loading,
    handleSubmit: submitEvent,
    handleDelete
  } = useEventOperations(venues, () => {
    resetForm();
    onSuccess();
  });

  const handleSubmit = (e: React.FormEvent) => {
    submitEvent(e, formData, editingEvent);
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
