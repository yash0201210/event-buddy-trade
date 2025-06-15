
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export const EventCard = ({ event, onEdit, onDelete }: EventCardProps) => {
  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return 'Not set';
    return new Date(dateTime).toLocaleString();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {event.name}
            </h3>
            <div className="text-gray-600 space-y-1">
              <p><strong>Venue:</strong> {event.venue}, {event.city}</p>
              <p><strong>Date:</strong> {formatDateTime(event.event_date)}</p>
              <p><strong>Category:</strong> {event.category}</p>
              {event.description && <p><strong>Description:</strong> {event.description}</p>}
              {event.ticket_types && event.ticket_types.length > 0 && (
                <p><strong>Ticket Types:</strong> {event.ticket_types.join(', ')}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(event)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(event.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
