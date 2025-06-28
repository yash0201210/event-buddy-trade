
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
  description?: string;
  image_url?: string;
  ticket_count?: number;
}

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      onClick={() => navigate(`/event/${event.id}`)}
    >
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        {event.image_url ? (
          <img 
            src={event.image_url} 
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {event.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.name}</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center text-left">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-left">{event.venue}, {event.city}</span>
          </div>
          
          <div className="flex items-center text-left">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-left">{formatDate(event.event_date)}</span>
          </div>
          
          {event.ticket_count !== undefined && event.ticket_count > 0 && (
            <div className="flex items-center text-left">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-left">{event.ticket_count} tickets available</span>
            </div>
          )}
        </div>
        
        <div className="mt-3">
          <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
            {event.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
