
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');

    if (!firecrawlApiKey) {
      throw new Error('Firecrawl API key not configured');
    }

    if (!url) {
      throw new Error('URL is required');
    }

    console.log('Scraping URL:', url);

    // Use Firecrawl to scrape the page
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown', 'extract'],
        extract: {
          schema: {
            type: "object",
            properties: {
              eventName: {
                type: "string",
                description: "The name/title of the event"
              },
              startDateTime: {
                type: "string", 
                description: "The start date and time of the event in ISO format or readable format"
              },
              endDateTime: {
                type: "string", 
                description: "The end date and time of the event in ISO format or readable format"
              },
              venue: {
                type: "string",
                description: "The venue or location name where the event is taking place"
              },
              venueAddress: {
                type: "string",
                description: "The full address of the venue including street, city, postcode"
              },
              city: {
                type: "string",
                description: "The city where the event is taking place"
              },
              description: {
                type: "string",
                description: "A description of the event"
              },
              category: {
                type: "string",
                description: "The category/type of event (e.g., concerts, sports, theatre, comedy, festivals)"
              },
              ticketTypes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name/title of the ticket type (e.g., 'General Admission', 'VIP', 'Early Bird')"
                    },
                    price: {
                      type: "string",
                      description: "The price of this ticket type (e.g., 'Free', '£25', '$30')"
                    },
                    description: {
                      type: "string",
                      description: "Additional details about this ticket type"
                    }
                  }
                },
                description: "Available ticket types with their names and prices"
              },
              imageUrl: {
                type: "string",
                description: "URL of the main event image"
              }
            }
          }
        }
      }),
    });

    if (!scrapeResponse.ok) {
      const errorText = await scrapeResponse.text();
      console.error('Firecrawl API error:', errorText);
      throw new Error(`Firecrawl API error: ${scrapeResponse.status}`);
    }

    const scrapeData = await scrapeResponse.json();
    console.log('Scrape response:', scrapeData);

    if (!scrapeData.success) {
      throw new Error('Failed to scrape the webpage');
    }

    // Extract the structured data
    const extractedData = scrapeData.data?.extract || {};
    
    // Clean and format the extracted data
    const eventDetails = {
      name: extractedData.eventName || '',
      venue: extractedData.venue || '',
      venue_address: extractedData.venueAddress || '',
      city: extractedData.city || '',
      start_date_time: formatDateTime(extractedData.startDateTime) || '',
      end_date_time: formatDateTime(extractedData.endDateTime) || '',
      category: mapCategory(extractedData.category) || 'concerts',
      description: extractedData.description || '',
      image_url: extractedData.imageUrl || '',
      ticket_types: formatTicketTypes(extractedData.ticketTypes) || [],
      ticket_prices: extractTicketPrices(extractedData.ticketTypes) || []
    };

    console.log('Extracted event details:', eventDetails);

    return new Response(JSON.stringify({ 
      success: true, 
      eventDetails,
      rawData: scrapeData.data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in scrape-event-details function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function formatDateTime(dateTimeString: string): string {
  if (!dateTimeString) return '';
  
  try {
    // Try to parse various date formats
    const date = new Date(dateTimeString);
    if (!isNaN(date.getTime())) {
      return date.toISOString(); // Return full ISO format with time
    }
    
    // If direct parsing fails, try to extract date patterns
    const datePatterns = [
      /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/,
      /(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/,
      /(\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2})/,
      /(\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2})/
    ];
    
    for (const pattern of datePatterns) {
      const match = dateTimeString.match(pattern);
      if (match) {
        const parsedDate = new Date(match[1]);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString();
        }
      }
    }
    
    return '';
  } catch {
    return '';
  }
}

function formatTicketTypes(ticketTypes: any[]): string[] {
  if (!Array.isArray(ticketTypes)) return [];
  
  return ticketTypes
    .map(ticket => ticket?.name || ticket)
    .filter(name => name && typeof name === 'string');
}

function extractTicketPrices(ticketTypes: any[]): Array<{name: string, price: string}> {
  if (!Array.isArray(ticketTypes)) return [];
  
  return ticketTypes
    .map(ticket => ({
      name: ticket?.name || 'Unknown',
      price: ticket?.price || 'Unknown'
    }))
    .filter(ticket => ticket.name !== 'Unknown');
}

function mapCategory(category: string): string {
  if (!category) return 'concerts';
  
  const categoryMap: { [key: string]: string } = {
    'music': 'concerts',
    'concert': 'concerts',
    'gig': 'concerts',
    'festival': 'festivals',
    'sport': 'sports',
    'football': 'sports',
    'rugby': 'sports',
    'basketball': 'sports',
    'theater': 'theatre',
    'theatre': 'theatre',
    'play': 'theatre',
    'comedy': 'comedy',
    'standup': 'comedy',
    'stand-up': 'comedy'
  };
  
  const lowerCategory = category.toLowerCase();
  return categoryMap[lowerCategory] || 'concerts';
}
