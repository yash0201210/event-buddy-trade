
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const suggestedEvents = [
  {
    id: 1,
    title: 'Taylor Swift - Eras Tour',
    venue: 'Wembley Stadium',
    location: 'London, UK',
    date: '2024-08-15',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
    priceFrom: '£125',
    category: 'Festival',
    rating: 4.9,
    ticketsAvailable: 15
  },
  {
    id: 4,
    title: 'Ed Sheeran Live',
    venue: 'O2 Arena',
    location: 'London, UK',
    date: '2024-09-05',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    priceFrom: '£67',
    category: 'Concert',
    rating: 4.7,
    ticketsAvailable: 89
  },
  {
    id: 5,
    title: 'Hamilton Musical',
    venue: 'Victoria Palace Theatre',
    location: 'London, UK',
    date: '2024-09-12',
    image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&h=300&fit=crop',
    priceFrom: '£95',
    category: 'Theatre',
    rating: 4.9,
    ticketsAvailable: 23
  },
  {
    id: 6,
    title: 'Comedy Night Live',
    venue: 'Apollo Theatre',
    location: 'London, UK',
    date: '2024-09-18',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    priceFrom: '£35',
    category: 'Comedy',
    rating: 4.5,
    ticketsAvailable: 56
  }
];

export const SuggestedEvents = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Suggested Events
          </h2>
          <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedEvents.map((event) => (
            <Link key={event.id} to={`/event/${event.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
