
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
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-white"
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
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
            {event.category}
          </span>
        </div>
        
        {/* Favorite button */}
        <div className="absolute top-4 right-4">
          <div className="bg-red-600 p-2 rounded-lg">
            <div className="w-4 h-4 bg-white" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-3 text-gray-900">{event.name}</h3>
        
        <div className="space-y-3 text-gray-600 mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
            <span>{event.venue}, {event.city}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
            <span>{formatDate(event.event_date)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-red-600 font-bold text-lg">
            from £25
          </div>
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
            View Tickets
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
