
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, GraduationCap, ExternalLink } from 'lucide-react';
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
  venue_id?: string;
  university_id?: string;
}

interface Venue {
  id: string;
  name: string;
  city: string;
  address?: string;
}

interface University {
  id: string;
  name: string;
  city: string;
}

interface EventInformationProps {
  event: Event;
  venue?: Venue | null;
  university?: University;
}

export const EventInformation = ({ event, venue, university }: EventInformationProps) => {
  const formatEventDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { dateStr, timeStr };
  };

  const handleMapClick = () => {
    const searchQuery = encodeURIComponent(`${venue?.name || event.venue}, ${venue?.address || event.city}`);
    window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
  };

  const { dateStr, timeStr } = formatEventDateTime(event.event_date);

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Information</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {university && event.university_id && (
              <div className="flex items-start space-x-3">
                <GraduationCap className="h-5 w-5 text-[#E8550D] mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">University</p>
                  <Link 
                    to={`/university/${event.university_id}`}
                    className="text-[#E8550D] hover:text-[#D44B0B] hover:underline break-words underline decoration-2 underline-offset-2 decoration-[#E8550D]/50"
                  >
                    {university.name}
                  </Link>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Date & Time</p>
                <p className="text-gray-600 break-words">{dateStr}</p>
                <p className="text-gray-600">{timeStr}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Location</p>
                <p className="text-gray-600 break-words">
                  {event.venue_id ? (
                    <Link 
                      to={`/venue/${event.venue_id}`}
                      className="text-[#E8550D] hover:text-[#D44B0B] hover:underline underline decoration-2 underline-offset-2 decoration-[#E8550D]/50"
                    >
                      {venue?.name || event.venue}
                    </Link>
                  ) : (
                    <span>{event.venue}</span>
                  )}
                </p>
                <p className="text-gray-600 break-words">{venue?.address || event.city}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Location Map
              <ExternalLink className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center relative overflow-hidden cursor-pointer hover:from-blue-200 hover:to-blue-300 transition-all duration-200"
              onClick={handleMapClick}
            >
              <div className="absolute inset-0 bg-blue-200 opacity-30"></div>
              <div className="relative z-10 text-center p-4">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-700 font-medium break-words">{venue?.name || event.venue}</p>
                <p className="text-blue-600 text-sm break-words">{venue?.address || event.city}</p>
                <button className="mt-3 text-blue-600 underline text-sm hover:text-blue-700">
                  View on Google Maps
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
