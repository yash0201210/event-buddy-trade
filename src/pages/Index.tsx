
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { CitySelector } from '@/components/home/CitySelector';
import { EventCategories } from '@/components/home/EventCategories';
import { SuggestedEvents } from '@/components/home/SuggestedEvents';
import { DiscoverMoreEvents } from '@/components/home/DiscoverMoreEvents';
import { UniTicketingSolution } from '@/components/home/UniTicketingSolution';
import { Footer } from '@/components/layout/Footer';
import { useGeolocation } from '@/hooks/useGeolocation';

const Index = () => {
  const { closestCity, loading } = useGeolocation();
  const [selectedCity, setSelectedCity] = useState('London');

  useEffect(() => {
    if (!loading && closestCity) {
      setSelectedCity(closestCity);
    }
  }, [closestCity, loading]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="space-y-0">
        <HeroSection />
        <div className="py-8">
          <CitySelector 
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
          />
        </div>
        <SuggestedEvents selectedCity={selectedCity} />
        <EventCategories />
        <DiscoverMoreEvents selectedCity={selectedCity} />
        <div className="bg-gray-100 py-12">
          <UniTicketingSolution />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
