
import React from 'react';

export const UniversitySkeleton = () => {
  return (
    <div className="flex-none w-48 animate-pulse">
      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-3"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  );
};
