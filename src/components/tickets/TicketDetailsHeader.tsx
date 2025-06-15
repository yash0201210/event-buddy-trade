
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TicketDetailsHeader = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="ghost" 
      onClick={() => navigate(-1)}
      className="mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to event
    </Button>
  );
};
