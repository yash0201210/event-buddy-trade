
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EventRequestsList } from '@/components/submit-event/EventRequestsList';

const SubmitEvent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventHyperlink: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit an event request",
        variant: "destructive"
      });
      return;
    }

    if (!formData.eventName.trim()) {
      toast({
        title: "Event name required",
        description: "Please enter the event name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('event_requests')
        .insert({
          user_id: user.id,
          event_name: formData.eventName.trim(),
          event_hyperlink: formData.eventHyperlink.trim() || null,
          description: formData.description.trim() || null,
          status: 'pending'
        });
        
      if (error) throw error;

      toast({
        title: "Event request submitted!",
        description: "Your event request has been sent for review. We'll get back to you within 24-48 hours.",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error submitting event request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit event request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h1 className="text-xl font-semibold mb-4">Authentication Required</h1>
              <p className="text-gray-600 mb-4">Please sign in to submit an event request</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Submit Your Event</CardTitle>
              <p className="text-gray-600">
                Want to sell a ticket for an event that doesn't exist on our platform? 
                Submit the event details here and we'll review it for inclusion.
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="eventName" className="text-sm font-medium">
                    Event Name*
                  </Label>
                  <Input
                    id="eventName"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    className="mt-1"
                    placeholder="Enter the full event name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventHyperlink" className="text-sm font-medium">
                    Event Hyperlink
                  </Label>
                  <Input
                    id="eventHyperlink"
                    type="url"
                    placeholder="https://www.eventbrite.com/..."
                    value={formData.eventHyperlink}
                    onChange={(e) => setFormData({ ...formData, eventHyperlink: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the link to the original event (e.g., on Eventbrite, Fatsoma, etc.)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Additional Details
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide any additional information about the event (date, venue, ticket types, etc.)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1"
                    rows={4}
                  />
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Please note:</strong> By submitting this form, your event is not guaranteed to be added to SocialDealer. 
                    Your request will be reviewed and you'll receive a response within 24-48 hours.
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Event Request'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <EventRequestsList />
        </div>
      </main>
    </div>
  );
};

export default SubmitEvent;
