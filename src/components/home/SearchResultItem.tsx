
import React from 'react';
import { MapPin, Calendar, GraduationCap, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface SearchResult {
  id: string;
  type: 'event' | 'venue' | 'university';
  title: string;
  description?: string;
  image_url?: string;
  event_date?: string;
  venue?: string;
  city?: string;
}

interface SearchResultItemProps {
  result: SearchResult;
  onSelect: () => void;
}

export const SearchResultItem = ({ result, onSelect }: SearchResultItemProps) => {
  const getIcon = () => {
    switch (result.type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-gray-400" />;
      case 'venue':
        return <Building2 className="h-4 w-4 text-gray-400" />;
      case 'university':
        return <GraduationCap className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getLink = () => {
    switch (result.type) {
      case 'event':
        return `/event/${result.id}`;
      case 'venue':
        return `/venue/${result.id}`;
      case 'university':
        return `/university/${result.id}`;
      default:
        return '#';
    }
  };

  const formatEventDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <Link 
      to={getLink()}
      onClick={onSelect}
      className="flex items-center p-3 hover:bg-gray-50 transition-colors"
    >
      <div className="flex-shrink-0 mr-3">
        {result.image_url ? (
          <img 
            src={result.image_url} 
            alt={result.title}
            className="w-10 h-10 rounded object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
            {getIcon()}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {result.title}
        </p>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          {result.event_date && result.type === 'event' && (
            <>
              <Calendar className="h-3 w-3 mr-1" />
              <span className="mr-3">{formatEventDate(result.event_date)}</span>
            </>
          )}
          {result.city && (
            <>
              <MapPin className="h-3 w-3 mr-1" />
              <span>{result.city}</span>
            </>
          )}
        </div>
        {result.description && (
          <p className="text-xs text-gray-500 truncate mt-1">
            {result.description}
          </p>
        )}
      </div>
    </Link>
  );
};
