
import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const cities = [
  'London',
  'Manchester',
  'Birmingham',
  'Liverpool',
  'Leeds',
  'Sheffield',
  'Bristol',
  'Newcastle',
  'Nottingham',
  'Edinburgh',
];

export const CitySelector = () => {
  const [selectedCity, setSelectedCity] = useState('London');

  return (
    <section className="py-6 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-start mb-6">
          <div className="flex items-center space-x-3 bg-white border border-gray-300 rounded-full px-6 py-3 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">
              Explore Events in
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 bg-transparent hover:bg-gray-50 px-3 py-1 rounded-lg transition-colors">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">{selectedCity}</span>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-white border shadow-lg">
                {cities.map((city) => (
                  <DropdownMenuItem
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </section>
  );
};
