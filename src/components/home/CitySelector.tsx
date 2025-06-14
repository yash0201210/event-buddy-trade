
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
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mr-3">
            What's on in
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border transition-colors">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-900">{selectedCity}</span>
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
    </section>
  );
};
