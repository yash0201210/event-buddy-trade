import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Pin, PinOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface University {
  id: string;
  name: string;
  city: string;
}

interface UniversityPin {
  id: string;
  user_id: string;
  university_id: string;
  created_at: string;
}

export const EventCategories = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  // Get user's pinned universities
  const { data: pinnedUniversities = [] } = useQuery({
    queryKey: ['user-pinned-universities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_university_pins')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UniversityPin[];
    },
    enabled: !!user,
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

  // Pin university mutation
  const pinUniversityMutation = useMutation({
    mutationFn: async (universityId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_university_pins')
        .insert({
          user_id: user.id,
          university_id: universityId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-pinned-universities'] });
    },
  });

  // Unpin university mutation
  const unpinUniversityMutation = useMutation({
    mutationFn: async (universityId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_university_pins')
        .delete()
        .eq('user_id', user.id)
        .eq('university_id', universityId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-pinned-universities'] });
    },
  });

  const isPinned = (universityId: string) => {
    return pinnedUniversities.some(pin => pin.university_id === universityId);
  };

  const handlePinToggle = (universityId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!user) return;

    if (isPinned(universityId)) {
      unpinUniversityMutation.mutate(universityId);
    } else {
      pinUniversityMutation.mutate(universityId);
    }
  };

  // Sort universities: pinned first, then alphabetically
  const sortedUniversities = React.useMemo(() => {
    if (!user) return universities;

    const pinned = universities.filter(uni => isPinned(uni.id));
    const unpinned = universities.filter(uni => !isPinned(uni.id));
    
    return [...pinned, ...unpinned];
  }, [universities, pinnedUniversities, user]);

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Browse by University
            </h2>
          </div>
          <div 
            className="overflow-x-auto scrollbar-hide"
            style={{
              overflowX: 'auto',
              scrollBehavior: 'smooth',
            }}
            onWheel={(e) => {
              e.currentTarget.scrollLeft += e.deltaY;
            }}
          >
            <div className="flex space-x-6 pb-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-none w-48 animate-pulse">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
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
        
        <div 
          className="overflow-x-auto scrollbar-hide"
          style={{
            overflowX: 'auto',
            scrollBehavior: 'smooth',
          }}
          onWheel={(e) => {
            e.currentTarget.scrollLeft += e.deltaY;
          }}
        >
          <div className="flex space-x-6 pb-4">
            {sortedUniversities.map((university) => {
              const eventCount = eventCounts[university.id] || 0;
              const isUniversityPinned = isPinned(university.id);
              
              return (
                <div key={university.id} className="flex-none w-48">
                  <Link to={`/university/${university.id}`} className="block">
                    <div className="flex flex-col items-center h-[280px]">
                      {/* Circular University Image */}
                      <div className={`w-32 h-32 mb-4 rounded-full overflow-hidden border-4 ${
                        isUniversityPinned ? 'border-orange-500' : 'border-blue-400'
                      } shadow-lg hover:shadow-xl transition-shadow flex-shrink-0`}>
                        <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
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
                              isUniversityPinned 
                                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                            onClick={(e) => handlePinToggle(university.id, e)}
                          >
                            {isUniversityPinned ? (
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
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
