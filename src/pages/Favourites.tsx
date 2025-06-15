
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { EventCard } from '@/components/home/EventCard';
import { EventCardSkeleton } from '@/components/home/EventCardSkeleton';

const Favourites = () => {
  const { user } = useAuth();

  const { data: favouriteEvents = [], isLoading } = useQuery({
    queryKey: ['user-favourite-events', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_event_favourites')
        .select(`
          event_id,
          events (
            id,
            name,
            venue,
            city,
            event_date,
            category,
            description,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Transform the data to match the Event interface
      return data.map(fav => ({
        ...fav.events,
        ticket_count: 0, // We can add this later if needed
      })).filter(event => event.id); // Filter out any null events
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
              <EventCardSkeleton key={i} />
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
              <EventCard key={event.id} event={event} />
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
