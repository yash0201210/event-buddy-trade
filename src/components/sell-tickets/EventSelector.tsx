
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Calendar, MapPin } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
  image_url?: string;
}

interface EventSelectorProps {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (eventId: string) => void;
  onSubmitEventRequest: () => void;
}

export const EventSelector = ({ events, selectedEvent, onEventSelect, onSubmitEventRequest }: EventSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.city.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="search" className="text-lg font-semibold mb-4 block">
          Sell Ticket: Select Event
        </Label>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            id="search"
            type="text"
            placeholder="Search For Events"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3 text-base border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((event) => (
          <Card 
            key={event.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedEvent?.id === event.id ? 'ring-2 ring-red-500 bg-red-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => onEventSelect(event.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {event.image_url ? (
                    <img 
                      src={event.image_url} 
                      alt={event.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-red-600 font-semibold text-xs text-center">
                      {event.category}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                    {event.name}
                  </h3>
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(event.event_date).toLocaleDateString('en-GB', { 
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{event.venue}, {event.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center py-6">
        <p className="text-gray-600 mb-4">
          Not able to find your event?{' '}
          <Button 
            variant="link" 
            className="p-0 h-auto text-red-600 hover:text-red-700 font-semibold"
            onClick={onSubmitEventRequest}
          >
            Submit Your Event
          </Button>
        </p>
      </div>
    </div>
  );
};
