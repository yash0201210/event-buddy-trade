
import React, { useState, useRef, useEffect } from 'react';
import { useSearch, SearchResult } from '@/hooks/useSearch';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { SearchDropdown } from './SearchDropdown';

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

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <section className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white py-20 w-full">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="w-full px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-passion text-5xl md:text-7xl font-bold mb-6 tracking-wide">
            SECURE. SELL. SOCIAL.
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 font-medium">
            Find Buyers And Sellers For Your Event!
          </p>
          
          <div className="max-w-2xl mx-auto relative" ref={searchRef}>
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFocus={handleFocus}
            />
            
            <SearchDropdown
              isOpen={isOpen}
              isLoading={isLoading}
              results={results}
              searchQuery={searchQuery}
              onResultClick={handleResultClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
