
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Calendar, Star } from 'lucide-react';

const favouriteEvents = [
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
    title: 'Reading Festival 2024',
    venue: 'Reading Festival Site',
    location: 'Reading, UK',
    date: '2024-08-30',
    image: '/placeholder.svg',
    priceFrom: '£125',
    category: 'Festival',
    rating: 4.9,
    ticketsAvailable: 15
  }
];

const Favourites = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favourites</h1>
          <p className="text-gray-600">Keep track of events you're interested in</p>
        </div>

        {favouriteEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favouriteEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
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
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600"
                    >
                      <Heart className="h-4 w-4 fill-current" />
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
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-2 fill-yellow-400 text-yellow-400" />
                      <span>{event.rating} rating</span>
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
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favourites yet</h3>
            <p className="text-gray-600 mb-6">Start adding events to your favourites to see them here</p>
            <Button className="bg-red-600 hover:bg-red-700">
              Browse Events
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Favourites;
