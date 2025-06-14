
import React from 'react';
import { Calendar, GraduationCap, MapPin } from 'lucide-react';
import { SearchResult } from '@/hooks/useSearch';

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
      case 'city':
        return <MapPin className="h-4 w-4 text-orange-500" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-400" />;
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

  return (
    <div
      onClick={() => onClick(result)}
      className={`flex items-center px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors group ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      <div className="flex-shrink-0 mr-3">
        {result.image ? (
          <img 
            src={result.image} 
            alt={result.title}
            className="w-8 h-8 rounded-md object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center ${result.image ? 'hidden' : ''}`}>
          {getResultIcon(result.type)}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h5 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {result.title}
        </h5>
        <div className="flex items-center text-xs text-gray-500 mt-0.5">
          {result.date && (
            <span className="mr-2 font-medium text-blue-600">
              {formatDate(result.date)}
            </span>
          )}
          {result.date && result.subtitle && <span className="mr-2">•</span>}
          <span className="truncate">
            {result.subtitle}
          </span>
        </div>
      </div>
      
      <div className="flex-shrink-0 ml-2">
        {getResultIcon(result.type)}
      </div>
    </div>
  );
};
