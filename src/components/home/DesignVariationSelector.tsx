
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DesignVariationSelectorProps {
  selectedVariation: string;
  onVariationChange: (variation: string) => void;
}

export const DesignVariationSelector = ({ selectedVariation, onVariationChange }: DesignVariationSelectorProps) => {
  const variations = [
    { id: 'original', name: 'Original Design' }
  ];

  return (
    <div className="fixed top-20 right-4 z-50">
      <Card className="w-64 shadow-lg">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 text-sm">Design Variations</h3>
          <div className="space-y-2">
            {variations.map((variation) => (
              <button
                key={variation.id}
                onClick={() => onVariationChange(variation.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedVariation === variation.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {variation.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
