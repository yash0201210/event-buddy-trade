
import React from 'react';
import { Search } from 'lucide-react';
import { SearchResult } from '@/hooks/useSearch';
import { SearchResultItem } from './SearchResultItem';

interface SearchDropdownProps {
  isOpen: boolean;
  isLoading: boolean;
  results: SearchResult[];
  searchQuery: string;
  onResultClick: (result: SearchResult) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  isLoading,
  results,
  searchQuery,
  onResultClick
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden max-w-2xl mx-auto">      
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-xs">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="max-h-80 overflow-y-auto">
          {results.map((result, index) => (
            <SearchResultItem
              key={`${result.type}-${result.id}`}
              result={result}
              onClick={onResultClick}
              isLast={index === results.length - 1}
            />
          ))}
        </div>
      ) : searchQuery.length >= 2 ? (
        <div className="p-6 text-center text-gray-500">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <h4 className="text-xs font-medium text-gray-900 mb-1">No results found</h4>
          <p className="text-xs text-gray-500">
            Try searching for events, venues, or cities
          </p>
        </div>
      ) : null}
    </div>
  );
};
