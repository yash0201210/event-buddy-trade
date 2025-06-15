
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EventUrlScraperProps {
  onDataScraped: (data: any) => void;
}

export const EventUrlScraper = ({ onDataScraped }: EventUrlScraperProps) => {
  const [hyperlinkUrl, setHyperlinkUrl] = useState('');
  const [scrapingLoading, setScrapingLoading] = useState(false);
  const { toast } = useToast();

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
        
        // Only pass defined values to avoid overwriting with empty strings
        const scrapedData = {
          ...(eventDetails.name && { name: eventDetails.name }),
          ...(eventDetails.venue && { venue: eventDetails.venue }),
          ...(eventDetails.city && { city: eventDetails.city }),
          ...(eventDetails.start_date_time && { 
            start_date_time: new Date(eventDetails.start_date_time).toISOString().slice(0, 16) 
          }),
          ...(eventDetails.end_date_time && { 
            end_date_time: new Date(eventDetails.end_date_time).toISOString().slice(0, 16) 
          }),
          ...(eventDetails.category && { category: eventDetails.category }),
          ...(eventDetails.description && { description: eventDetails.description }),
          ...(eventDetails.image_url && { image_url: eventDetails.image_url }),
          ...(eventDetails.ticket_types?.length > 0 && { ticket_types: eventDetails.ticket_types })
        };

        onDataScraped(scrapedData);

        if (eventDetails.ticket_prices && eventDetails.ticket_prices.length > 0) {
          console.log('Extracted ticket prices for reference:', eventDetails.ticket_prices);
        }

        toast({
          title: "Data scraped successfully",
          description: "Event information has been extracted and pre-filled in the form. You can now edit any field as needed.",
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
        Enter an event URL to automatically extract event details. All fields remain editable after extraction.
      </p>
    </div>
  );
};
