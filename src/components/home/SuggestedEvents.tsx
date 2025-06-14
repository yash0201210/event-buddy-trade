
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const suggestedEvents = [
  {
    id: 1,
    title: 'Taylor Swift - Eras Tour',
    venue: 'Wembley Stadium',
    location: 'London, UK',
    date: '2024-08-15',
    image: '/placeholder.svg',
    priceFrom: '£89',
    category: 'Concert',
    rating: 4.8,
    ticketsAvailable: 42
  },
  {
    id: 2,
    title: 'Arsenal vs Manchester City',
    venue: 'Emirates Stadium',
    location: 'London, UK',
    date: '2024-08-20',
    image: '/placeholder.svg',
    priceFrom: '£45',
    category: 'Sports',
    rating: 4.6,
    ticketsAvailable: 28
  },
  {
    id: 3,
    title: 'The Lion King',
    venue: 'Lyceum Theatre',
    location: 'London, UK',
    date: '2024-08-25',
    image: '/placeholder.svg',
    priceFrom: '£35',
    category: 'Theatre',
    rating: 4.9,
    ticketsAvailable: 15
  },
  {
    id: 4,
    title: 'Reading Festival 2024',
    venue: 'Reading Festival Site',
    location: 'Reading, UK',
    date: '2024-08-30',
    image: '/placeholder.svg',
    priceFrom: '£125',
    category: 'Festival',
    rating: 4.7,
    ticketsAvailable: 8
  }
];

export const SuggestedEvents = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Suggested Events
          </h2>
          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
            View All Events
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestedEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative">
                  <Link to={`/event/${event.id}`}>
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-t-lg hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                    {event.category}
                  </span>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {event.ticketsAvailable} tickets available
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <Link to={`/event/${event.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors">
                    {event.title}
                  </h3>
                </Link>
                
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
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-2 fill-yellow-400 text-yellow-400" />
                    <span>{event.rating} rating</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-red-600">
                    from {event.priceFrom}
                  </span>
                  <Link to={`/event/${event.id}`}>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      View Tickets
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
