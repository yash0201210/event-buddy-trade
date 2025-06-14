
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
    <main className="space-y-8">
      <HeroSection />
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gray-50 rounded-2xl p-8">
            <CitySelector />
          </div>
        </div>
      </div>
      <div className="bg-white">
        <SuggestedEvents />
      </div>
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <EventCategories />
      </div>
      <div className="bg-white">
        <DiscoverMoreEvents />
      </div>
      <div className="bg-gray-50">
        <UniTicketingSolution />
      </div>
    </main>
  );

  const renderDesignOption2 = () => (
    <main className="space-y-0">
      <HeroSection />
      <div className="bg-white py-4">
        <CitySelector />
      </div>
      <div className="bg-gradient-to-r from-red-50 to-orange-50 py-12">
        <SuggestedEvents />
      </div>
      <div className="bg-white py-16">
        <EventCategories />
      </div>
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto">
          <DiscoverMoreEvents />
        </div>
      </div>
      <div className="bg-gradient-to-b from-white to-gray-100 py-12">
        <UniTicketingSolution />
      </div>
    </main>
  );

  const renderDesignOption3 = () => (
    <main className="space-y-0">
      <HeroSection />
      <div className="bg-white border-b border-gray-200">
        <CitySelector />
      </div>
      <div className="bg-white py-20">
        <SuggestedEvents />
      </div>
      <div className="bg-gray-50 py-20">
        <EventCategories />
      </div>
      <div className="bg-white py-20">
        <DiscoverMoreEvents />
      </div>
      <div className="bg-gradient-to-t from-red-600 to-red-500 text-white py-16">
        <UniTicketingSolution />
      </div>
    </main>
  );

  const renderDesignOption4 = () => (
    <main className="space-y-0">
      <HeroSection />
      <div className="bg-gray-100 py-6">
        <CitySelector />
      </div>
      <div className="bg-white py-8">
        <SuggestedEvents />
      </div>
      <div className="bg-gray-50 py-8">
        <EventCategories />
      </div>
      <div className="bg-white py-8">
        <DiscoverMoreEvents />
      </div>
      <div className="bg-gray-100 py-8">
        <UniTicketingSolution />
      </div>
    </main>
  );

  const designOptions = [
    { id: 1, name: "Card-based with Rounded Sections", component: renderDesignOption1 },
    { id: 2, name: "Gradient & Dark Contrast", component: renderDesignOption2 },
    { id: 3, name: "Clean Minimalist", component: renderDesignOption3 },
    { id: 4, name: "Compact & Uniform", component: renderDesignOption4 },
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
