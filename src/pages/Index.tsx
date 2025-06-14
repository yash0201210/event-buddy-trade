
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CitySelector } from '@/components/home/CitySelector';
import { EventCategories } from '@/components/home/EventCategories';
import { SuggestedEvents } from '@/components/home/SuggestedEvents';
import { DiscoverMoreEvents } from '@/components/home/DiscoverMoreEvents';
import { UniTicketingSolution } from '@/components/home/UniTicketingSolution';
import { Footer } from '@/components/layout/Footer';
import { DesignVariationSelector } from '@/components/home/DesignVariationSelector';
import { VariationWrapper } from '@/components/home/VariationWrapper';

const Index = () => {
  const [selectedVariation, setSelectedVariation] = useState('original');

  return (
    <VariationWrapper variation={selectedVariation}>
      <DesignVariationSelector 
        selectedVariation={selectedVariation}
        onVariationChange={setSelectedVariation}
      />
      
      <Header />
      
      <main className="space-y-0">
        <HeroSection />
        <CitySelector />
        <SuggestedEvents />
        <EventCategories />
        <DiscoverMoreEvents />
        <div className="bg-gray-100 py-12">
          <UniTicketingSolution />
        </div>
      </main>
      
      <Footer />
    </VariationWrapper>
  );
};

export default Index;
