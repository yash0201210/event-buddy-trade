
import React from 'react';
import { Calendar, MapPin, GraduationCap, Building2 } from 'lucide-react';
import { SearchResult } from '@/hooks/useSearch';

interface SearchResultItemProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
  isLast?: boolean;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  onClick,
  isLast = false
}) => {
  const handleClick = () => {
    onClick(result);
  };

  const getIcon = () => {
    switch (result.type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-[#E8550D]" />;
      case 'venue':
        return <Building2 className="h-4 w-4 text-gray-500" />;
      case 'university':
        return <GraduationCap className="h-4 w-4 text-blue-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return '';
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {result.title}
              </h4>
              
              {result.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {result.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 mt-1">
                {result.city && (
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {result.city}
                  </div>
                )}
                
                {result.venue && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Building2 className="h-3 w-3 mr-1" />
                    {result.venue}
                  </div>
                )}
              </div>
            </div>
            
            {result.start_date_time && (
              <div className="text-xs text-gray-400 ml-2">
                {formatDate(result.start_date_time)}
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
