
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, User, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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

interface EventRequestCardProps {
  request: EventRequest;
  onApprove: (request: EventRequest) => void;
  onReject: (requestId: string, reason: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export const EventRequestCard = ({ 
  request, 
  onApprove, 
  onReject, 
  isApproving, 
  isRejecting 
}: EventRequestCardProps) => {
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);

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

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    onReject(request.id, rejectionReason.trim());
    setRejectionReason('');
    setDialogOpen(false);
  };

  return (
    <Card>
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
              onClick={() => onApprove(request)}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </Button>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
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
                      disabled={isRejecting || !rejectionReason.trim()}
                      variant="destructive"
                    >
                      {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
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
  );
};
