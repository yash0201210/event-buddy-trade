
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
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div
      onClick={() => onClick(result)}
      className={`flex items-center px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      <div className="flex-shrink-0 mr-4">
        {result.image ? (
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            <img 
              src={result.image} 
              alt={result.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center">${target.parentElement!.lastElementChild!.outerHTML}</div>`;
              }}
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            {getResultIcon(result.type)}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {result.title}
        </h3>
        {result.date && (
          <p className="text-sm text-gray-600 mb-1">
            {formatDate(result.date)}
          </p>
        )}
        <p className="text-sm text-gray-500">
          {result.subtitle}
        </p>
      </div>
    </div>
  );
};
