
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Link } from 'lucide-react';
import { Event, University, Venue, EventFormData } from '@/types/event';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EventFormProps {
  editingEvent: Event | null;
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  newTicketType: string;
  setNewTicketType: React.Dispatch<React.SetStateAction<string>>;
  universities: University[];
  venues: Venue[];
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const EventForm = ({
  editingEvent,
  formData,
  setFormData,
  newTicketType,
  setNewTicketType,
  universities,
  venues,
  loading,
  onSubmit,
  onCancel
}: EventFormProps) => {
  const [hyperlinkUrl, setHyperlinkUrl] = useState('');
  const [scrapingLoading, setScrapingLoading] = useState(false);
  const { toast } = useToast();

  const addTicketType = () => {
    if (newTicketType.trim() && !formData.ticket_types.includes(newTicketType.trim())) {
      setFormData({
        ...formData,
        ticket_types: [...formData.ticket_types, newTicketType.trim()]
      });
      setNewTicketType('');
    }
  };

  const removeTicketType = (typeToRemove: string) => {
    setFormData({
      ...formData,
      ticket_types: formData.ticket_types.filter(type => type !== typeToRemove)
    });
  };

  const handleScrapeData = async () => {
    if (!hyperlinkUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setScrapingLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-event-details', {
        body: { url: hyperlinkUrl }
      });

      if (error) throw error;

      if (data?.success && data?.eventDetails) {
        const eventDetails = data.eventDetails;
        
        setFormData(prevData => ({
          ...prevData,
          name: eventDetails.name || prevData.name,
          venue: eventDetails.venue || prevData.venue,
          city: eventDetails.city || prevData.city,
          start_date_time: eventDetails.start_date_time ? 
            new Date(eventDetails.start_date_time).toISOString().slice(0, 16) : prevData.start_date_time,
          end_date_time: eventDetails.end_date_time ? 
            new Date(eventDetails.end_date_time).toISOString().slice(0, 16) : prevData.end_date_time,
          category: eventDetails.category || prevData.category,
          description: eventDetails.description || prevData.description,
          image_url: eventDetails.image_url || prevData.image_url,
          ticket_types: eventDetails.ticket_types?.length > 0 ? eventDetails.ticket_types : prevData.ticket_types
        }));

        if (eventDetails.ticket_prices && eventDetails.ticket_prices.length > 0) {
          console.log('Extracted ticket prices for reference:', eventDetails.ticket_prices);
        }

        toast({
          title: "Data scraped successfully",
          description: "Event information has been extracted and pre-filled in the form.",
        });
      } else {
        throw new Error(data?.error || 'Failed to scrape event details');
      }
    } catch (error: any) {
      console.error('Error scraping data:', error);
      toast({
        title: "Scraping failed",
        description: "Could not extract event details from the URL. You can still fill the form manually.",
        variant: "destructive"
      });
    } finally {
      setScrapingLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* URL Scraping Section */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <Label htmlFor="hyperlink" className="text-sm font-medium mb-2 block">
            Auto-fill from Event URL (Optional)
          </Label>
          <div className="flex gap-2">
            <Input
              id="hyperlink"
              value={hyperlinkUrl}
              onChange={(e) => setHyperlinkUrl(e.target.value)}
              placeholder="https://example.com/event-page"
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={handleScrapeData}
              disabled={scrapingLoading || !hyperlinkUrl.trim()}
              variant="outline"
            >
              <Link className="h-4 w-4 mr-2" />
              {scrapingLoading ? 'Scraping...' : 'Extract Data'}
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Enter an event URL to automatically extract event details and fill the form below.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => setFormData({...formData, venue: e.target.value})}
                placeholder="Enter venue name (will create if not in list)"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="start_date_time">Start Date & Time</Label>
              <Input
                id="start_date_time"
                type="datetime-local"
                value={formData.start_date_time}
                onChange={(e) => setFormData({...formData, start_date_time: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date_time">End Date & Time</Label>
              <Input
                id="end_date_time"
                type="datetime-local"
                value={formData.end_date_time}
                onChange={(e) => setFormData({...formData, end_date_time: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concerts">Concerts</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="theatre">Theatre</SelectItem>
                  <SelectItem value="comedy">Comedy</SelectItem>
                  <SelectItem value="festivals">Festivals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="venue_select">Venue (from list)</Label>
              <Select 
                value={formData.venue_id} 
                onValueChange={(value) => setFormData({...formData, venue_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select venue (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No venue selected</SelectItem>
                  {venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name} - {venue.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="university">University</Label>
            <Select 
              value={formData.university_id} 
              onValueChange={(value) => setFormData({...formData, university_id: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select university (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No university</SelectItem>
                {universities.map((university) => (
                  <SelectItem key={university.id} value={university.id}>
                    {university.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label>Ticket Types</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTicketType}
                  onChange={(e) => setNewTicketType(e.target.value)}
                  placeholder="e.g., General Admission, VIP, Early Bird"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTicketType())}
                />
                <Button type="button" onClick={addTicketType} variant="outline">
                  Add
                </Button>
              </div>
              {formData.ticket_types.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.ticket_types.map((type, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      <span>{type}</span>
                      <button
                        type="button"
                        onClick={() => removeTicketType(type)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
