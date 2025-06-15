
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface EventRequest {
  id: string;
  user_id: string;
  event_name: string;
  event_hyperlink: string | null;
  description: string | null;
  status: string;
  created_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

interface ScrapedEventDetails {
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
  description: string;
  image_url: string;
  ticket_types: string[];
}

export const useEventRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: eventRequests = [], isLoading } = useQuery({
    queryKey: ['admin-event-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const scrapeEventDetails = async (url: string): Promise<ScrapedEventDetails | null> => {
    try {
      console.log('Scraping event details from:', url);
      
      const { data, error } = await supabase.functions.invoke('scrape-event-details', {
        body: { url }
      });

      if (error) {
        console.error('Error calling scrape function:', error);
        throw error;
      }

      if (!data?.success) {
        console.error('Scraping failed:', data?.error);
        throw new Error(data?.error || 'Failed to scrape event details');
      }

      console.log('Successfully scraped event details:', data.eventDetails);
      return data.eventDetails;
    } catch (error) {
      console.error('Error scraping event details:', error);
      toast({
        title: "Scraping failed",
        description: "Could not extract event details from the URL. You can still create the event manually.",
        variant: "destructive"
      });
      return null;
    }
  };

  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('event_requests')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: async (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-requests'] });
      
      const approvedRequest = eventRequests.find(req => req.id === requestId);
      
      toast({
        title: "Event request approved",
        description: "Scraping event details...",
      });

      let scrapedData: ScrapedEventDetails | null = null;
      
      // Try to scrape event details if URL is provided
      if (approvedRequest?.event_hyperlink) {
        scrapedData = await scrapeEventDetails(approvedRequest.event_hyperlink);
      }

      if (approvedRequest) {
        navigate('/admin/events', { 
          state: { 
            autoOpenForm: true,
            prefillData: scrapedData || {
              name: approvedRequest.event_name,
              description: approvedRequest.description || ''
            }
          }
        });
      } else {
        navigate('/admin/events', { 
          state: { autoOpenForm: true }
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve event request",
        variant: "destructive"
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('event_requests')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-requests'] });
      toast({
        title: "Event request rejected",
        description: "The event request has been rejected with feedback.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject event request",
        variant: "destructive"
      });
    }
  });

  return {
    eventRequests,
    isLoading,
    approveRequest: (request: EventRequest) => approveMutation.mutate(request.id),
    rejectRequest: (requestId: string, reason: string) => 
      rejectMutation.mutate({ requestId, reason }),
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending
  };
};
