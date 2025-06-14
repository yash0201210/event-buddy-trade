
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  { name: 'Concerts', icon: '🎵', count: '2,847' },
  { name: 'Sports', icon: '⚽', count: '1,532' },
  { name: 'Theater', icon: '🎭', count: '843' },
  { name: 'Comedy', icon: '😂', count: '621' },
  { name: 'Festivals', icon: '🎪', count: '394' },
  { name: 'Family', icon: '👨‍👩‍👧‍👦', count: '287' },
];

export const EventCategories = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Browse by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} events</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
