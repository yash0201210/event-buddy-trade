
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CitySelector } from '@/components/home/CitySelector';
import { EventCategories } from '@/components/home/EventCategories';
import { SuggestedEvents } from '@/components/home/SuggestedEvents';
import { DiscoverMoreEvents } from '@/components/home/DiscoverMoreEvents';
import { UniTicketingSolution } from '@/components/home/UniTicketingSolution';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [designVariation, setDesignVariation] = useState(1);

  const renderDesignOption1 = () => (
    <main className="space-y-0">
      <HeroSection />
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <CitySelector />
      </div>
      <div className="bg-white py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-50 to-transparent opacity-50"></div>
        <div className="relative">
          <SuggestedEvents />
        </div>
      </div>
      <div className="bg-gradient-to-b from-gray-100 to-white py-20">
        <EventCategories />
      </div>
      <div className="bg-white py-16">
        <DiscoverMoreEvents />
      </div>
      <div className="bg-gray-100 py-12">
        <UniTicketingSolution />
      </div>
    </main>
  );

  const renderDesignOption2 = () => (
    <main className="space-y-0">
      <HeroSection />
      <div className="bg-white py-8 border-b-4 border-red-100">
        <CitySelector />
      </div>
      <div className="bg-gradient-to-r from-red-600 to-orange-500 py-2"></div>
      <div className="bg-white py-16">
        <SuggestedEvents />
      </div>
      <div className="bg-gradient-to-r from-red-600 to-orange-500 py-2"></div>
      <div className="bg-gray-50 py-20">
        <EventCategories />
      </div>
      <div className="bg-gradient-to-r from-red-600 to-orange-500 py-2"></div>
      <div className="bg-white py-16">
        <DiscoverMoreEvents />
      </div>
      <div className="bg-gray-200 py-12">
        <UniTicketingSolution />
      </div>
    </main>
  );

  const renderDesignOption3 = () => (
    <main className="space-y-8">
      <HeroSection />
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 shadow-sm">
            <CitySelector />
          </div>
        </div>
      </div>
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-sm">
            <SuggestedEvents />
          </div>
        </div>
      </div>
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 shadow-sm">
            <EventCategories />
          </div>
        </div>
      </div>
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 shadow-sm">
            <DiscoverMoreEvents />
          </div>
        </div>
      </div>
      <div className="bg-gray-100 py-12">
        <UniTicketingSolution />
      </div>
    </main>
  );

  const renderDesignOption4 = () => (
    <main className="space-y-0">
      <HeroSection />
      <div className="bg-white py-8 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-orange-500"></div>
        <CitySelector />
      </div>
      <div className="bg-gray-50 py-16 relative">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500"></div>
        <SuggestedEvents />
      </div>
      <div className="bg-white py-20 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-green-500"></div>
        <EventCategories />
      </div>
      <div className="bg-gray-50 py-16 relative">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-red-500"></div>
        <DiscoverMoreEvents />
      </div>
      <div className="bg-gray-200 py-12">
        <UniTicketingSolution />
      </div>
    </main>
  );

  const renderDesignOption5 = () => (
    <main className="space-y-0">
      <HeroSection />
      <div className="bg-white py-8">
        <CitySelector />
      </div>
      <div className="bg-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500 rounded-full blur-xl"></div>
        </div>
        <div className="relative">
          <SuggestedEvents />
        </div>
      </div>
      <div className="bg-gradient-to-b from-white via-gray-50 to-white py-20">
        <EventCategories />
      </div>
      <div className="bg-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 via-transparent to-green-500"></div>
        </div>
        <div className="relative">
          <DiscoverMoreEvents />
        </div>
      </div>
      <div className="bg-gray-100 py-12">
        <UniTicketingSolution />
      </div>
    </main>
  );

  const renderDesignOption6 = () => (
    <main className="space-y-0">
      <HeroSection />
      <div className="bg-white py-8 border-l-8 border-red-500">
        <CitySelector />
      </div>
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="border-l-8 border-purple-500 pl-8">
            <SuggestedEvents />
          </div>
        </div>
      </div>
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="border-l-8 border-blue-500 pl-8">
            <EventCategories />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="border-l-8 border-green-500 pl-8">
            <DiscoverMoreEvents />
          </div>
        </div>
      </div>
      <div className="bg-gray-200 py-12">
        <UniTicketingSolution />
      </div>
    </main>
  );

  const designOptions = [
    { id: 1, name: "Gradient Overlays", component: renderDesignOption1 },
    { id: 2, name: "Bold Separators", component: renderDesignOption2 },
    { id: 3, name: "Colorful Cards", component: renderDesignOption3 },
    { id: 4, name: "Side Accents", component: renderDesignOption4 },
    { id: 5, name: "Floating Orbs", component: renderDesignOption5 },
    { id: 6, name: "Colored Borders", component: renderDesignOption6 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Design Variation Selector - Remove this in production */}
      <div className="bg-yellow-100 border-b border-yellow-200 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium text-gray-800">Choose Design:</span>
            {designOptions.map((option) => (
              <Button
                key={option.id}
                onClick={() => setDesignVariation(option.id)}
                variant={designVariation === option.id ? "default" : "outline"}
                size="sm"
                className="text-xs"
              >
                Option {option.id}: {option.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {designOptions.find(option => option.id === designVariation)?.component()}
      
      <Footer />
    </div>
  );
};

export default Index;
