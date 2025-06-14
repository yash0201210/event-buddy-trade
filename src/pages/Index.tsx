
import React from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { EventCategories } from '@/components/home/EventCategories';
import { SuggestedEvents } from '@/components/home/SuggestedEvents';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <EventCategories />
        <SuggestedEvents />
      </main>
    </div>
  );
};

export default Index;
