
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, ExternalLink, User, Clock } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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

const AdminEventRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<EventRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-requests'] });
      toast({
        title: "Event request approved",
        description: "The event request has been approved. You can now create the event.",
      });
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
      setSelectedRequest(null);
      setRejectionReason('');
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = (request: EventRequest) => {
    approveMutation.mutate(request.id);
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejecting this request",
        variant: "destructive"
      });
      return;
    }

    rejectMutation.mutate({
      requestId: selectedRequest.id,
      reason: rejectionReason.trim()
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading event requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Event Requests</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {eventRequests.filter(req => req.status === 'pending').length} Pending
          </Badge>
        </div>
      </div>

      {eventRequests.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No event requests found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {eventRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{request.event_name}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{request.user_id}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {request.event_hyperlink && (
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                    <a 
                      href={request.event_hyperlink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      View original event
                    </a>
                  </div>
                )}
                
                {request.description && (
                  <div>
                    <p className="text-sm text-gray-600">{request.description}</p>
                  </div>
                )}

                {request.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      <strong>Rejection reason:</strong> {request.rejection_reason}
                    </p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(request)}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {approveMutation.isPending ? 'Approving...' : 'Approve'}
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="destructive"
                          onClick={() => setSelectedRequest(request)}
                        >
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Event Request</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">
                            Provide a reason for rejecting "{request.event_name}":
                          </p>
                          <div>
                            <Label htmlFor="rejection-reason">Rejection Reason</Label>
                            <Textarea
                              id="rejection-reason"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Please explain why this event request is being rejected..."
                              rows={3}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={handleReject}
                              disabled={rejectMutation.isPending}
                              variant="destructive"
                            >
                              {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(null);
                                setRejectionReason('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEventRequests;
