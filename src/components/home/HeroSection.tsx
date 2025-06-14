
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, MapPin, Calendar, Star, GraduationCap } from 'lucide-react';
import { useSearch, SearchResult } from '@/hooks/useSearch';
import { useNavigate } from 'react-router-dom';

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
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Group results by type for better organization
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const typeLabels = {
    event: 'Events',
    university: 'Universities',
    venue: 'Venues',
    city: 'Cities'
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
            <div className="bg-white rounded-2xl p-1 shadow-xl flex items-center relative">
              <div className="flex items-center flex-1 px-6 py-3">
                <Search className="h-5 w-5 text-gray-400 mr-4" />
                <Input
                  type="text"
                  placeholder="Search for an event, artist, venue or city"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  className="border-0 bg-transparent text-gray-900 placeholder-gray-500 text-base focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0"
                />
              </div>
              <Button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl p-3 mr-1"
                size="sm"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-hidden">
                {isLoading ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                    <p className="text-sm">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {Object.entries(groupedResults).map(([type, typeResults]) => (
                      <div key={type} className="border-b border-gray-50 last:border-b-0">
                        <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            {getResultIcon(type)}
                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                              {typeLabels[type as keyof typeof typeLabels]}
                            </h4>
                          </div>
                        </div>
                        <div>
                          {typeResults.map((result) => (
                            <div
                              key={`${result.type}-${result.id}`}
                              onClick={() => handleResultClick(result)}
                              className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors group border-b border-gray-50 last:border-b-0"
                            >
                              <div className="flex-shrink-0 mr-3">
                                {result.image ? (
                                  <img 
                                    src={result.image} 
                                    alt={result.title}
                                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                ) : null}
                                <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 ${result.image ? 'hidden' : ''}`}>
                                  {getResultIcon(result.type)}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-medium text-gray-900 truncate group-hover:text-red-600 transition-colors">
                                  {result.title}
                                </h5>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-xs text-gray-500 truncate">
                                    {result.subtitle}
                                  </p>
                                  {result.date && (
                                    <>
                                      <span className="text-gray-300">•</span>
                                      <p className="text-xs text-gray-500">
                                        {formatDate(result.date)}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6 text-gray-300" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">No results found</h4>
                    <p className="text-xs text-gray-500">
                      Try searching for events, venues, universities, or cities
                    </p>
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
