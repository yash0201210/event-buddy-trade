
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  onSearch?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onFocus,
  placeholder = "Search events...",
  onSearch
}) => {
  return (
    <div className="bg-white rounded-full p-2 shadow-lg flex items-center relative max-w-2xl mx-auto">
      <div className="flex items-center flex-1 px-4 py-2">
        <Search className="h-5 w-5 text-gray-400 mr-3" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus}
          className="border-0 bg-transparent text-gray-900 placeholder-gray-400 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0 w-full"
        />
      </div>
      <Button 
        className="bg-primary hover:bg-primary/90 text-white rounded-full h-10 w-10 p-0 flex items-center justify-center"
        size="sm"
        onClick={onSearch}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};
