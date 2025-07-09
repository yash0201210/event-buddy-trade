
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TicketAlertProps {
  eventId: string;
  eventName?: string;
}

export const TicketAlert = ({ eventId, eventName }: TicketAlertProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check if user has an active alert for this event
  const { data: hasAlert = false, isLoading } = useQuery({
    queryKey: ['ticket-alert', eventId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('ticket_alerts')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking ticket alert:', error);
        return false;
      }

      return !!data;
    },
    enabled: !!user,
  });

  const toggleAlertMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('toggle_ticket_alert', {
        event_uuid: eventId
      });

      if (error) throw error;
      return data; // Returns true if alert was enabled, false if disabled
    },
    onSuccess: (alertEnabled) => {
      queryClient.invalidateQueries({ queryKey: ['ticket-alert', eventId, user?.id] });
      
      toast({
        title: alertEnabled ? "Alert enabled" : "Alert disabled",
        description: alertEnabled 
          ? "You'll be notified when new tickets become available"
          : "You won't receive notifications for this event",
      });
    },
    onError: (error: any) => {
      console.error('Error toggling ticket alert:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket alert. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggleAlert = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to set up ticket alerts",
      });
      navigate('/auth');
      return;
    }

    toggleAlertMutation.mutate();
  };

  if (isLoading) return null;

  return (
    <Card className="bg-blue-50 border-blue-200 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bell className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 text-center mx-6">
            <h3 className="font-semibold text-gray-900 mb-1">Ticket alerts</h3>
            <p className="text-gray-600 text-sm">
              {hasAlert 
                ? "You'll be notified when new tickets become available"
                : "Get notified when a ticket becomes available"
              }
            </p>
          </div>
          
          <Button 
            variant="outline"
            onClick={handleToggleAlert}
            disabled={toggleAlertMutation.isPending}
            className={`${hasAlert ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-600 text-blue-600'} hover:bg-blue-700 hover:text-white flex-shrink-0`}
          >
            {hasAlert ? (
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
