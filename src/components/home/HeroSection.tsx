
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, MapPin } from 'lucide-react';

export const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find the Perfect Tickets
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Buy and sell tickets safely with verified sellers. Get the best deals on concerts, sports, and live events.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event or Artist
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search events, artists, teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="City or venue"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
              Search Tickets
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
