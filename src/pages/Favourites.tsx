
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { EventCard } from '@/components/home/EventCard';
import { EmptyEventsState } from '@/components/home/EmptyEventsState';
import { EventCardSkeleton } from '@/components/home/EventCardSkeleton';
import { useFavourites } from '@/hooks/useFavourites';

const Favourites = () => {
  const { favouriteEvents, isLoading, toggleFavourite } = useFavourites();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Favourite Events</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : favouriteEvents.length === 0 ? (
          <EmptyEventsState 
            title="No favourite events yet"
            description="Start exploring events and add them to your favourites to see them here."
            actionText="Browse Events"
            actionLink="/"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favouriteEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onFavouriteToggle={() => toggleFavourite(event.id)}
                isFavourite={true}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favourites;
