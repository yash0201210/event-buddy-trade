
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SellTicketPromptProps {
  eventId: string;
}

export const SellTicketPrompt = ({ eventId }: SellTicketPromptProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSellTickets = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to sell tickets",
      });
      navigate('/auth');
      return;
    }
    navigate('/sell-tickets');
  };

  return (
    <Card className="bg-orange-50 border-[#E8550D]/30 mb-6">
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Do you have a spare ticket for this event?
          </h3>
          <p className="text-gray-600 mb-4">
            List your tickets and reach thousands of potential buyers
          </p>
          <Button 
            onClick={handleSellTickets}
            className="bg-[#E8550D] hover:bg-[#D44B0B] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Sell Tickets
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
