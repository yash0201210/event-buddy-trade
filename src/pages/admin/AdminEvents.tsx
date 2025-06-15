
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EventForm } from '@/components/admin/events/EventForm';
import { EventCard } from '@/components/admin/events/EventCard';
import { useAdminEvents } from '@/hooks/useAdminEvents';

const AdminEvents = () => {
  const {
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
  } = useAdminEvents();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Create and manage events for ticket listings</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {showForm && (
        <EventForm
          editingEvent={editingEvent}
          formData={formData}
          setFormData={setFormData}
          newTicketType={newTicketType}
          setNewTicketType={setNewTicketType}
          universities={universities}
          venues={venues}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <div className="grid gap-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={startEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
