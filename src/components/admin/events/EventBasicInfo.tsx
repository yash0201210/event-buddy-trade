
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventFormData, University, Venue } from '@/types/event';

interface EventBasicInfoProps {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  universities: University[];
  venues: Venue[];
}

export const EventBasicInfo = ({
  formData,
  setFormData,
  universities,
  venues
}: EventBasicInfoProps) => {
  return (
    <>
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
    </>
  );
};
