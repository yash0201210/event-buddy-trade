
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
}

interface EventSelectorProps {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (eventId: string) => void;
}

export const EventSelector = ({ events, selectedEvent, onEventSelect }: EventSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="event">Choose Event</Label>
        <Select value={selectedEvent?.id || ''} onValueChange={onEventSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name} - {event.venue}, {event.city} ({new Date(event.event_date).toLocaleDateString()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedEvent && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">{selectedEvent.name}</h3>
          <p className="text-gray-600">
            {selectedEvent.venue}, {selectedEvent.city} • {new Date(selectedEvent.event_date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Category: {selectedEvent.category}</p>
        </div>
      )}
    </div>
  );
};
