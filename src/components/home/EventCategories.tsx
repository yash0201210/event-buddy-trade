
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUniversityPins } from '@/hooks/useUniversityPins';
import { UniversityCard } from './UniversityCard';
import { UniversitySkeleton } from './UniversitySkeleton';

interface University {
  id: string;
  name: string;
  city: string;
  image_url?: string;
  image_position?: string;
}

export const EventCategories = () => {
  const { user } = useAuth();
  const { pinnedUniversities, isPinned, handlePinToggle } = useUniversityPins();

  const { data: universities = [], isLoading } = useQuery({
    queryKey: ['universities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as University[];
    },
  });

  // Get event count for each university
  const { data: eventCounts = {} } = useQuery({
    queryKey: ['university-event-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('university_id');

      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data.forEach((event) => {
        if (event.university_id) {
          counts[event.university_id] = (counts[event.university_id] || 0) + 1;
        }
      });
      
      return counts;
    },
  });

  // Sort universities: pinned first, then alphabetically
  const sortedUniversities = React.useMemo(() => {
    if (!user) return universities;

    const pinned = universities.filter(uni => isPinned(uni.id));
    const unpinned = universities.filter(uni => !isPinned(uni.id));
    
    return [...pinned, ...unpinned];
  }, [universities, pinnedUniversities, user]);

  if (isLoading) {
    return (
      <section className="py-4 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Browse by University
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="flex space-x-6 pb-4">
              {[...Array(5)].map((_, i) => (
                <UniversitySkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Browse by University
          </h2>
          <Link to="/universities">
            <Button variant="outline" className="flex items-center gap-2">
              View All Unis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="flex space-x-6 pb-4 min-w-max">
            {sortedUniversities.map((university) => {
              const eventCount = eventCounts[university.id] || 0;
              const isUniversityPinned = isPinned(university.id);
              
              return (
                <UniversityCard
                  key={university.id}
                  university={university}
                  eventCount={eventCount}
                  isPinned={isUniversityPinned}
                  onPinToggle={handlePinToggle}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
