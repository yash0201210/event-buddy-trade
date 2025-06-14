
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface University {
  id: string;
  name: string;
  city: string;
}

export const EventCategories = () => {
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

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Browse by University
            </h2>
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
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
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
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
        
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-6 pb-4">
            {universities.map((university, index) => {
              const eventCount = eventCounts[university.id] || 0;
              const isPinned = index === 0; // First university is pinned for demo
              
              return (
                <div key={university.id} className="flex-none w-48">
                  <Link to={`/university/${university.id}`} className="block">
                    <div className="text-center">
                      {/* Circular University Image */}
                      <div className={`w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 ${
                        isPinned ? 'border-orange-500' : 'border-blue-400'
                      } shadow-lg hover:shadow-xl transition-shadow`}>
                        <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                          <GraduationCap className="h-12 w-12 text-blue-600" />
                        </div>
                      </div>
                      
                      {/* University Name */}
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm px-2 border-b border-gray-300 pb-1">
                        {university.name}
                      </h3>
                      
                      {/* Event Count */}
                      <p className="text-xs text-gray-500 mb-3">
                        {eventCount} upcoming events
                      </p>
                      
                      {/* Pin/Unpin Button */}
                      <Button 
                        size="sm" 
                        className={`rounded-full px-4 ${
                          isPinned 
                            ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                      >
                        {isPinned ? 'Pinned' : 'Pin University'}
                      </Button>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};
