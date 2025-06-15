
import React from 'react';
import { Calendar, GraduationCap, MapPin } from 'lucide-react';
import type { SearchResult } from '@/types/event';

interface SearchResultItemProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
  isLast: boolean;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, onClick, isLast }) => {
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'university':
        return <GraduationCap className="h-4 w-4 text-purple-500" />;
      case 'venue':
        return <MapPin className="h-4 w-4 text-green-500" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div
      onClick={() => onClick(result)}
      className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      <div className="flex-shrink-0 mr-4">
        {result.image_url ? (
          <img 
            src={result.image_url} 
            alt={result.title}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${result.image_url ? 'hidden' : ''}`}>
          {getResultIcon(result.type)}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {result.title}
        </h3>
        {result.start_date_time && (
          <p className="text-sm text-gray-600 mb-1">
            {formatDate(result.start_date_time)}
          </p>
        )}
        <p className="text-sm text-gray-500">
          {result.description || result.city}
        </p>
      </div>
    </div>
  );
};
