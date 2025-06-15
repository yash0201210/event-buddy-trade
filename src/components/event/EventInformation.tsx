
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, GraduationCap, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event, Venue, University } from '@/types/event';

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

  const { dateStr, timeStr } = formatEventDateTime(event.start_date_time);

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Information</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {university && event.university_id && (
              <div className="flex items-start space-x-3">
                <GraduationCap className="h-5 w-5 text-[#E8550D] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">University</p>
                  <Link 
                    to={`/university/${event.university_id}`}
                    className="text-[#E8550D] hover:text-[#D44B0B] hover:underline"
                  >
                    {university.name}
                  </Link>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Date & Time</p>
                <p className="text-gray-600">{dateStr}</p>
                <p className="text-gray-600">{timeStr}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-gray-600">
                  {event.venue_id ? (
                    <Link 
                      to={`/venue/${event.venue_id}`}
                      className="text-[#E8550D] hover:text-[#D44B0B] hover:underline"
                    >
                      {venue?.name || event.venue}
                    </Link>
                  ) : (
                    <span>{event.venue}</span>
                  )}
                </p>
                <p className="text-gray-600">{venue?.address || event.city}</p>
              </div>
            </div>

            {event.description && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-900 mb-2">Description</p>
                <p className="text-gray-600">{event.description}</p>
              </div>
            )}
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
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-200 opacity-30"></div>
              <div className="relative z-10 text-center">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-blue-700 font-medium">{venue?.name || event.venue}</p>
                <p className="text-blue-600 text-sm">{venue?.address || event.city}</p>
                <button className="mt-3 text-blue-600 underline text-sm hover:text-blue-700">
                  View on map
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
