
import React from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CitySelector } from '@/components/home/CitySelector';
import { EventCategories } from '@/components/home/EventCategories';
import { SuggestedEvents } from '@/components/home/SuggestedEvents';
import { DiscoverMoreEvents } from '@/components/home/DiscoverMoreEvents';
import { UniTicketingSolution } from '@/components/home/UniTicketingSolution';
import { Footer } from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="space-y-0">
        <HeroSection />
        <div className="py-8">
          <CitySelector />
        </div>
        <SuggestedEvents />
        <EventCategories />
        <DiscoverMoreEvents />
        <div className="bg-gray-100 py-12">
          <UniTicketingSolution />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
