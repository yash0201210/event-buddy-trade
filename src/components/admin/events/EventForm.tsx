
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Event, University, Venue, EventFormData } from '@/types/event';
import { EventBasicInfo } from './EventBasicInfo';
import { EventTicketTypes } from './EventTicketTypes';

interface EventFormProps {
  editingEvent: Event | null;
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  newTicketType: string;
  setNewTicketType: React.Dispatch<React.SetStateAction<string>>;
  universities: University[];
  venues: Venue[];
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const EventForm = ({
  editingEvent,
  formData,
  setFormData,
  newTicketType,
  setNewTicketType,
  universities,
  venues,
  loading,
  onSubmit,
  onCancel
}: EventFormProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <EventBasicInfo
            formData={formData}
            setFormData={setFormData}
            universities={universities}
            venues={venues}
          />

          <EventTicketTypes
            formData={formData}
            setFormData={setFormData}
            newTicketType={newTicketType}
            setNewTicketType={setNewTicketType}
          />

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
