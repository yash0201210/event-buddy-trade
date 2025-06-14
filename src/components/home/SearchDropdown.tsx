
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
    <div className="absolute top-full left-1 right-1 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
      {isLoading ? (
        <div className="p-6 text-center text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mx-auto mb-2"></div>
          <p className="text-sm">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="max-h-80 overflow-y-auto py-2">
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
        <div className="p-8 text-center text-gray-500">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">No results found</h4>
          <p className="text-xs text-gray-500">
            Try searching for events, venues, universities, or cities
          </p>
        </div>
      ) : null}
    </div>
  );
};
