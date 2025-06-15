
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const EventCardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="p-0">
        <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
      </CardContent>
    </Card>
  );
};
