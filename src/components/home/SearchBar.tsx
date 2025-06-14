
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFocus: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onFocus
}) => {
  return (
    <div className="bg-white rounded-2xl p-1 shadow-xl flex items-center relative">
      <div className="flex items-center flex-1 px-6 py-3">
        <Search className="h-5 w-5 text-gray-400 mr-4" />
        <Input
          type="text"
          placeholder="Search for an event, artist, venue or city"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus}
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
  );
};
