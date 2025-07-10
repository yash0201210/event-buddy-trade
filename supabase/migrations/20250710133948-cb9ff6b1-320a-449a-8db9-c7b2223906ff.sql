-- Add more test events to populate the "Discover More Events" section
INSERT INTO public.events (
  name,
  venue,
  city,
  event_date,
  category,
  description,
  image_url
) VALUES 
(
  'Autumn Art Exhibition',
  'Royal Gallery',
  'London',
  '2025-04-20',
  'Art',
  'Contemporary art exhibition featuring emerging artists',
  'https://images.unsplash.com/photo-1544967882-6abaa86637a2?w=800&h=400&fit=crop'
),
(
  'Comedy Night Live',
  'City Comedy Club',
  'London',
  '2025-04-25',
  'Comedy',
  'Stand-up comedy night with top comedians',
  'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=400&fit=crop'
),
(
  'Tech Conference 2025',
  'Innovation Center',
  'London',
  '2025-05-10',
  'Technology',
  'Latest trends in technology and innovation',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'
),
(
  'Food & Wine Festival',
  'Central Park',
  'London',
  '2025-05-15',
  'Food',
  'Culinary delights and wine tasting experience',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop'
),
(
  'Summer Sports Day',
  'Olympic Stadium',
  'London',
  '2025-06-01',
  'Sports',
  'Athletic competitions and sports activities',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop'
),
(
  'Theatre Performance',
  'West End Theatre',
  'London',
  '2025-06-10',
  'Theatre',
  'Classic theatre performance by renowned actors',
  'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=400&fit=crop'
),
(
  'Jazz Evening',
  'Blue Note Club',
  'London',
  '2025-06-20',
  'Music',
  'Smooth jazz evening with local musicians',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop'
);