
import React from 'react';
import { User } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto h-12 w-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
        <User className="h-6 w-6 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600 mt-2">{subtitle}</p>
    </div>
  );
};
