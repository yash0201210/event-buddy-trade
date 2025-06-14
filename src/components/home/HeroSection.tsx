
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, MapPin, Calendar, Star, GraduationCap } from 'lucide-react';
import { useSearch, SearchResult } from '@/hooks/useSearch';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { results, isLoading, isOpen, setIsOpen } = useSearch(searchQuery);

  useEffect(() => {
    setIsOpen(isFocused && searchQuery.length >= 2);
  }, [isFocused, searchQuery, setIsOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery(result.title);
    setIsOpen(false);
    setIsFocused(false);

    switch (result.type) {
      case 'event':
        navigate(`/event/${result.id}`);
        break;
      case 'university':
        navigate(`/university/${result.id}`);
        break;
      case 'venue':
        navigate(`/venue/${result.id}`);
        break;
      case 'city':
        // Navigate to events filtered by city or just stay on home page
        navigate('/');
        break;
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'university':
        return <GraduationCap className="h-4 w-4 text-purple-500" />;
      case 'venue':
        return <MapPin className="h-4 w-4 text-green-500" />;
      case 'city':
        return <MapPin className="h-4 w-4 text-orange-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      event: 'bg-blue-100 text-blue-700',
      university: 'bg-purple-100 text-purple-700',
      venue: 'bg-green-100 text-green-700',
      city: 'bg-orange-100 text-orange-700'
    };

    return (
      <Badge className={`text-xs ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700'}`}>
        {type}
      </Badge>
    );
  };

  return (
    <section className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white py-20">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-passion text-5xl md:text-7xl font-bold mb-6 tracking-wide">
            SECURE. SELL. SOCIAL.
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 font-medium">
            Find Buyers And Sellers For Your Event!
          </p>
          
          <div className="max-w-2xl mx-auto" ref={searchRef}>
            <div className="bg-white rounded-full p-2 shadow-lg flex items-center relative">
              <div className="flex items-center flex-1 px-4">
                <Search className="h-6 w-6 text-gray-400 mr-3" />
                <Input
                  type="text"
                  placeholder="Search for an event, artist, venue or city"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  className="border-0 bg-transparent text-gray-900 placeholder-gray-500 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button 
                className="bg-white hover:bg-gray-50 text-gray-600 rounded-full p-3 mr-1"
                size="sm"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-2 text-sm">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 px-3 py-2 uppercase tracking-wide">
                      Search Results
                    </div>
                    {results.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group"
                      >
                        <div className="flex-shrink-0 mr-3">
                          {result.image ? (
                            <img 
                              src={result.image} 
                              alt={result.title}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              {getResultIcon(result.type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-red-600 transition-colors">
                              {result.title}
                            </p>
                            {getTypeBadge(result.type)}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {result.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm">No results found for "{searchQuery}"</p>
                    <p className="text-xs text-gray-400 mt-1">Try searching for events, venues, universities, or cities</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
