
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <section className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white py-20">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-wide">
            SECURE. SELL. SOCIAL.
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 font-medium">
            Find Buyers And Sellers For Your Event!
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-full p-2 shadow-lg flex items-center">
              <div className="flex items-center flex-1 px-4">
                <Search className="h-6 w-6 text-gray-400 mr-3" />
                <Input
                  type="text"
                  placeholder="Search For Event, Artist, Venue Or City"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent text-gray-900 placeholder-gray-500 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-white hover:bg-gray-50 text-gray-600 rounded-full p-3 mr-1"
                size="sm"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
