
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Favourites = () => {
  const { user } = useAuth();

  const { data: favouriteEvents = [], isLoading } = useQuery({
    queryKey: ['user-favourites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // For now, return empty array since we don't have a favourites table yet
      // This will be implemented when the user adds the favourites functionality
      return [];
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Please sign in</h3>
            <p className="text-gray-600 mb-6">Sign in to view your favourite events</p>
            <Link to="/auth">
              <Button className="bg-red-600 hover:bg-red-700">
                Sign In
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favourites</h1>
            <p className="text-gray-600">Keep track of events you're interested in</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="p-0">
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

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
            <Link to="/">
              <Button className="bg-red-600 hover:bg-red-700">
                Browse Events
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Favourites;
