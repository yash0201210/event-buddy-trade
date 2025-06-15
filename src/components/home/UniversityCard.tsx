
import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, Pin, PinOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface University {
  id: string;
  name: string;
  city: string;
  image_url?: string;
  image_position?: string;
}

interface UniversityCardProps {
  university: University;
  eventCount: number;
  isPinned: boolean;
  onPinToggle: (universityId: string, event: React.MouseEvent) => void;
}

export const UniversityCard = ({ university, eventCount, isPinned, onPinToggle }: UniversityCardProps) => {
  const { user } = useAuth();

  return (
    <div className="flex-none w-48">
      <Link to={`/university/${university.id}`} className="block">
        <div className="flex flex-col items-center h-[280px]">
          {/* Circular University Image */}
          <div className={`w-32 h-32 mb-4 rounded-full overflow-hidden border-4 ${
            isPinned ? 'border-orange-500' : 'border-blue-400'
          } shadow-lg hover:shadow-xl transition-shadow flex-shrink-0`}>
            {university.image_url ? (
              <img 
                src={university.image_url} 
                alt={university.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: university.image_position || 'center center' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center ${university.image_url ? 'hidden' : ''}`}>
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          {/* University Name - Fixed height container with consistent spacing */}
          <div className="h-14 flex flex-col items-center justify-start mb-2 flex-shrink-0">
            <div className="flex-grow flex items-center px-2">
              <h3 className="font-semibold text-gray-900 text-sm text-center leading-tight">
                {university.name}
              </h3>
            </div>
            <div className="w-24 border-b border-gray-300 mt-2"></div>
          </div>
          
          {/* Event Count - Fixed height */}
          <div className="h-6 flex items-center justify-center mb-6 flex-shrink-0">
            <p className="text-xs text-gray-500 text-center">
              {eventCount} upcoming events
            </p>
          </div>
          
          {/* Spacer to push button to exact bottom */}
          <div className="flex-grow"></div>
          
          {/* Pin/Unpin Button - Always at bottom */}
          {user && (
            <div className="flex-shrink-0">
              <Button 
                size="sm" 
                className={`rounded-full px-4 ${
                  isPinned 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                onClick={(e) => onPinToggle(university.id, e)}
              >
                {isPinned ? (
                  <>
                    <PinOff className="h-3 w-3 mr-1" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="h-3 w-3 mr-1" />
                    Pin
                  </>
                )}
              </Button>
            </div>
          )}
          
          {!user && (
            <div className="flex-shrink-0">
              <Button 
                size="sm" 
                className="rounded-full px-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
                disabled
              >
                <Pin className="h-3 w-3 mr-1" />
                Pin University
              </Button>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
