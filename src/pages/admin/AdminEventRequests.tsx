
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventRequestCard } from '@/components/admin/event-requests/EventRequestCard';
import { useEventRequests } from '@/hooks/useEventRequests';

const AdminEventRequests = () => {
  const { eventRequests, isLoading, approveRequest, rejectRequest, isApproving, isRejecting } = useEventRequests();

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
            <EventRequestCard
              key={request.id}
              request={request}
              onApprove={approveRequest}
              onReject={rejectRequest}
              isApproving={isApproving}
              isRejecting={isRejecting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEventRequests;
