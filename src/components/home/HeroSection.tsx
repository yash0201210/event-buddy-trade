import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const HeroSection = () => {
  const [location, setLocation] = useState('');
  const [event, setEvent] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    // Navigate to search results or filter events
    console.log('Searching for:', { location, event, date });
  };

  return (
    <section className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Amazing Events Near You
          </h1>
          <p className="text-xl mb-2 text-red-100">
            📍 Pin your favorite unis
          </p>
          <p className="text-lg mb-8 text-red-100">
            🎯 Explore events in your area and beyond
          </p>
          
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  type="text"
                  placeholder="Event type"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  type="date"
                  placeholder="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-1">
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-red-100 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Concerts', 'Football', 'Theatre', 'Comedy', 'Festivals'].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => setEvent(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
