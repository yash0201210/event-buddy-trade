
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TicketDetailsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-start mb-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="p-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to event
      </Button>
    </div>
  );
};
