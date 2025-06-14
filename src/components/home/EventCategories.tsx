
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Trophy, Theater, Gamepad2, Mic, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Concerts', icon: Music, color: 'bg-purple-100 text-purple-600', count: 245 },
  { id: 2, name: 'Sports', icon: Trophy, color: 'bg-green-100 text-green-600', count: 189 },
  { id: 3, name: 'Theatre', icon: Theater, color: 'bg-blue-100 text-blue-600', count: 167 },
  { id: 4, name: 'Comedy', icon: Mic, color: 'bg-yellow-100 text-yellow-600', count: 98 },
  { id: 5, name: 'Gaming', icon: Gamepad2, color: 'bg-red-100 text-red-600', count: 76 },
  { id: 6, name: 'Festivals', icon: Calendar, color: 'bg-pink-100 text-pink-600', count: 134 }
];

export const EventCategories = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} to={`/?category=${category.name.toLowerCase()}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} events</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
