
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

interface University {
  id: string;
  name: string;
  city: string;
  country: string;
}

const Universities = () => {
  const { data: universities = [], isLoading } = useQuery({
    queryKey: ['all-universities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as University[];
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">All Universities</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200"></div>
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Universities</h1>
        
        {universities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No universities available yet</p>
            <p className="text-sm text-gray-500">Check back soon for more universities!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {universities.map((university) => (
              <Link key={university.id} to={`/university/${university.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">{university.name}</h3>
                    <p className="text-xs text-gray-500">{university.city}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Universities;
