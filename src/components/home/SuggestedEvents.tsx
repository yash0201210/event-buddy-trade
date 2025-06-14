
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Calendar } from 'lucide-react';

const suggestedEvents = [
  {
    id: 1,
    title: 'Taylor Swift - Eras Tour',
    venue: 'Wembley Stadium',
    location: 'London, UK',
    date: '2024-08-15',
    image: '/placeholder.svg',
    priceFrom: '£89',
    category: 'Concert'
  },
  {
    id: 2,
    title: 'Arsenal vs Manchester City',
    venue: 'Emirates Stadium',
    location: 'London, UK',
    date: '2024-08-20',
    image: '/placeholder.svg',
    priceFrom: '£45',
    category: 'Sports'
  },
  {
    id: 3,
    title: 'The Lion King',
    venue: 'Lyceum Theatre',
    location: 'London, UK',
    date: '2024-08-25',
    image: '/placeholder.svg',
    priceFrom: '£35',
    category: 'Theater'
  },
  {
    id: 4,
    title: 'Reading Festival 2024',
    venue: 'Reading Festival Site',
    location: 'Reading, UK',
    date: '2024-08-30',
    image: '/placeholder.svg',
    priceFrom: '£125',
    category: 'Festival'
  }
];

export const SuggestedEvents = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Suggested Events
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestedEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="p-0">
                <div className="relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                    {event.category}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-2" />
                    <span>{event.venue}, {event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString('en-GB', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-red-600">
                    from {event.priceFrom}
                  </span>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    View Tickets
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
