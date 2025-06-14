
import React from 'react';

interface VariationWrapperProps {
  variation: string;
  children: React.ReactNode;
}

export const VariationWrapper = ({ variation, children }: VariationWrapperProps) => {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
};
