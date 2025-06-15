import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
interface EventRequest {
  id: string;
  event_name: string;
  event_hyperlink: string | null;
  description: string | null;
  status: string;
  created_at: string;
  rejection_reason: string | null;
}
export const EventRequestsList = () => {
  const {
    user
  } = useAuth();
  const {
    data: eventRequests = [],
    isLoading
  } = useQuery({
    queryKey: ['user-event-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const {
        data,
        error
      } = await supabase.from('event_requests').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending Review
          </Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  if (!user) return null;
  if (isLoading) {
    return <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading your submissions...</div>
        </CardContent>
      </Card>;
  }
  if (eventRequests.length === 0) {
    return <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Event Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-4">
            <p>You haven't submitted any event requests yet.</p>
            <p className="text-sm mt-1">Submit your first event using the form above!</p>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Event Submissions</CardTitle>
        <p className="text-sm text-gray-600">
          Track the status of your submitted event requests
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {eventRequests.map(request => <div key={request.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900">{request.event_name}</h3>
                <p className="text-sm text-gray-500">
                  Submitted on {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              {getStatusBadge(request.status)}
            </div>

            {request.event_hyperlink && <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-gray-400" />
                <a href={request.event_hyperlink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline text-sm">
                  View original event
                </a>
              </div>}

            {request.description && <div>
                <p className="text-sm text-gray-600">{request.description}</p>
              </div>}

            {request.rejection_reason && <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>Rejection reason:</strong> {request.rejection_reason}
                </p>
              </div>}

            {request.status === 'approved' && <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 text-left">Great! Your event has been approved and will be available on our platform in the next 24 hours.</p>
              </div>}
          </div>)}
      </CardContent>
    </Card>;
};