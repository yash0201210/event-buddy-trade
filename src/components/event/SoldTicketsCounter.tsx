
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface SoldTicketsCounterProps {
  count: number;
}

export const SoldTicketsCounter = ({ count }: SoldTicketsCounterProps) => {
  if (count === 0) return null;

  return (
    <div className="mb-6">
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-green-700">
            <TrendingUp className="h-5 w-5 mr-2" />
            <span className="font-medium">
              {count} ticket{count === 1 ? '' : 's'} sold
            </span>
            <span className="ml-2 text-sm text-green-600">
              - High demand event!
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
