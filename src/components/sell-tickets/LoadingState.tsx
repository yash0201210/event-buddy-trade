
import React from 'react';
import { Header } from '@/components/layout/Header';

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading events...</div>
      </div>
    </div>
  );
};
