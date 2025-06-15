
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface University {
  id: string;
  name: string;
}

interface Venue {
  id: string;
  name: string;
  city: string;
}

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
  description?: string;
  image_url?: string;
  ticket_types?: string[];
  university_id?: string;
  venue_id?: string;
}

interface EventFormProps {
  editingEvent: Event | null;
  formData: {
    name: string;
    venue: string;
    city: string;
    event_date: string;
    category: string;
    description: string;
    image_url: string;
    ticket_types: string[];
    university_id: string;
    venue_id: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
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

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
      </CardHeader>
      <CardContent>
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
              <Label htmlFor="event_date">Event Date</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                required
              />
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="e.g., Premium, General Admission, VIP"
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
