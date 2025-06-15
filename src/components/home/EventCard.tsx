
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar, Star, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          {event.image_url ? (
            <img 
              src={event.image_url} 
              alt={event.name}
              className="w-full h-48 object-cover rounded-t-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-t-lg flex items-center justify-center">
              <span className="text-red-600 font-medium">{event.category}</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Badge className="absolute top-2 left-2 bg-red-600 text-white">
            {event.category}
          </Badge>
          {event.ticket_count !== undefined && event.ticket_count > 0 && (
            <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <Ticket className="h-3 w-3" />
              <span>{event.ticket_count} tickets</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.name}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-2" />
            <span>{event.venue}, {event.city}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-2" />
            <span>{new Date(event.event_date).toLocaleDateString('en-GB', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            })}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-3 w-3 mr-2 fill-yellow-400 text-yellow-400" />
            <span>4.8 rating</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-red-600">
            from £25
          </span>
          <Link to={`/event/${event.id}`}>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              View Tickets
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
