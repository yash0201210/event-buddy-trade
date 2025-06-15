
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface TicketAlertProps {
  eventId: string;
}

export const TicketAlert = ({ eventId }: TicketAlertProps) => {
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleToggleAlert = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to set up ticket alerts",
      });
      navigate('/auth');
      return;
    }

    setIsAlertEnabled(!isAlertEnabled);
    toast({
      title: isAlertEnabled ? "Alert disabled" : "Alert enabled",
      description: isAlertEnabled 
        ? "You won't receive notifications for this event"
        : "You'll be notified when tickets become available",
    });
  };

  return (
    <Card className="bg-blue-50 border-blue-200 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bell className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 text-center mx-6">
            <h3 className="font-semibold text-gray-900 mb-1">Ticket alerts</h3>
            <p className="text-gray-600 text-sm">Get notified when a ticket becomes available</p>
          </div>
          
          <Button 
            variant="outline"
            onClick={handleToggleAlert}
            className={`${isAlertEnabled ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-600 text-blue-600'} hover:bg-blue-700 hover:text-white flex-shrink-0`}
          >
            {isAlertEnabled ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Disable
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Enable alerts
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
