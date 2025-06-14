import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

interface University {
  id: string;
  name: string;
}

interface Venue {
  id: string;
  name: string;
  city: string;
}

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    city: '',
    event_date: '',
    category: '',
    description: '',
    image_url: '',
    ticket_types: [] as string[],
    university_id: '',
    venue_id: ''
  });
  const [newTicketType, setNewTicketType] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchUniversities();
    fetchVenues();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          universities(name),
          venues(name, city)
        `)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive"
      });
    }
  };

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setUniversities(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch universities",
        variant: "destructive"
      });
    }
  };

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('id, name, city')
        .order('name');

      if (error) throw error;
      setVenues(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch venues",
        variant: "destructive"
      });
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        university_id: formData.university_id || null,
        venue_id: formData.venue_id || null
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        
        toast({
          title: "Event updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from('events')
          .insert(eventData);

        if (error) throw error;
        
        toast({
          title: "Event created successfully!",
        });
      }

      resetForm();
      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      
      toast({
        title: "Event deleted successfully!",
      });
      
      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      venue: '',
      city: '',
      event_date: '',
      category: '',
      description: '',
      image_url: '',
      ticket_types: [],
      university_id: '',
      venue_id: ''
    });
    setEditingEvent(null);
    setShowForm(false);
    setNewTicketType('');
  };

  const startEdit = (event: Event) => {
    setFormData({
      name: event.name,
      venue: event.venue,
      city: event.city,
      event_date: event.event_date,
      category: event.category,
      description: event.description || '',
      image_url: event.image_url || '',
      ticket_types: event.ticket_types || [],
      university_id: event.university_id || '',
      venue_id: event.venue_id || ''
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Create and manage events for ticket listings</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                      <SelectItem value="">No university</SelectItem>
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
                      <SelectItem value="">No venue selected</SelectItem>
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
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {event.name}
                  </h3>
                  <div className="text-gray-600 space-y-1">
                    <p><strong>Venue:</strong> {event.venue}, {event.city}</p>
                    <p><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</p>
                    <p><strong>Category:</strong> {event.category}</p>
                    {event.description && <p><strong>Description:</strong> {event.description}</p>}
                    {event.ticket_types && event.ticket_types.length > 0 && (
                      <p><strong>Ticket Types:</strong> {event.ticket_types.join(', ')}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEdit(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
