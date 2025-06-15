
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
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-requests'] });
      
      const approvedRequest = eventRequests.find(req => req.id === requestId);
      
      toast({
        title: "Event request approved",
        description: "Redirecting to create the event...",
      });

      if (approvedRequest) {
        navigate('/admin/events', { 
          state: { 
            autoOpenForm: true,
            prefillData: {
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
