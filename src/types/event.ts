
export interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  start_date_time: string;
  end_date_time?: string;
  category: string;
  description?: string;
  image_url?: string;
  ticket_types?: string[];
  university_id?: string;
  venue_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface University {
  id: string;
  name: string;
  city?: string;
  image_url?: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  address?: string;
}

export interface EventFormData {
  name: string;
  venue: string;
  city: string;
  start_date_time: string;
  end_date_time: string;
  category: string;
  description: string;
  image_url: string;
  ticket_types: string[];
  university_id: string;
  venue_id: string;
}

export interface SearchResult {
  id: string;
  type: 'event' | 'venue' | 'university';
  title: string;
  description?: string;
  image_url?: string;
  start_date_time?: string;
  venue?: string;
  city?: string;
}
