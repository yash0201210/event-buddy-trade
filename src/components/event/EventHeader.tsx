
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Calendar, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event, Venue, University } from '@/types/event';
import { useFavourites } from '@/hooks/useFavourites';

interface EventHeaderProps {
  event: Event;
  venue?: Venue | null;
  university?: University;
}

export const EventHeader = ({ event, venue, university }: EventHeaderProps) => {
  const { isFavourite, toggleFavourite } = useFavourites();

  return (
    <div className="relative mb-6">
      {/* Background Image */}
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
        {event.image_url ? (
          <img 
            src={event.image_url} 
            alt={event.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
            <span className="text-red-600 font-medium text-xl">{event.category}</span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="text-white">
            <Badge variant="secondary" className="mb-3 bg-[#E8550D] text-white border-none hover:bg-[#D44B0B]">
              {event.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {event.name}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm md:text-base">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>
                  {event.venue_id ? (
                    <Link 
                      to={`/venue/${event.venue_id}`}
                      className="hover:underline"
                    >
                      {venue?.name || event.venue}
                    </Link>
                  ) : (
                    <span>{event.venue}</span>
                  )}
                  , {event.city}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(event.start_date_time).toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
              
              {university && event.university_id && (
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <Link 
                    to={`/university/${event.university_id}`}
                    className="hover:underline"
                  >
                    {university.name}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Favorite Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => toggleFavourite(event.id)}
          className={`absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm ${isFavourite(event.id) ? 'text-[#E8550D]' : ''}`}
        >
          <Heart className={`h-5 w-5 ${isFavourite(event.id) ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
