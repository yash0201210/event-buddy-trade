
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  event_date: string;
  category: string;
  ticket_types?: string[];
}

interface TicketFormData {
  ticketType: string;
  quantity: number;
  originalPrice: number;
  sellingPrice: number;
  description: string;
  isNegotiable: boolean;
}

interface TicketDetailsFormProps {
  data: TicketFormData;
  onChange: (data: TicketFormData) => void;
  selectedEvent: Event | null;
}

export const TicketDetailsForm = ({ data, onChange, selectedEvent }: TicketDetailsFormProps) => {
  const handleInputChange = (field: keyof TicketFormData, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Ticket Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ticketType">Ticket Type</Label>
            <Select 
              value={data.ticketType} 
              onValueChange={(value) => handleInputChange('ticketType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ticket type" />
              </SelectTrigger>
              <SelectContent>
                {selectedEvent?.ticket_types?.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                )) || (
                  <SelectItem value="" disabled>No ticket types available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={data.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="originalPrice">Original Price (£)</Label>
            <Input
              id="originalPrice"
              type="number"
              step="0.01"
              value={data.originalPrice}
              onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value))}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <Label htmlFor="sellingPrice">Selling Price (£)</Label>
            <Input
              id="sellingPrice"
              type="number"
              step="0.01"
              value={data.sellingPrice}
              onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value))}
              placeholder="0.00"
              required
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add any additional details about your tickets..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="negotiable"
              checked={data.isNegotiable}
              onCheckedChange={(checked) => handleInputChange('isNegotiable', checked)}
            />
            <Label htmlFor="negotiable">Open to offers</Label>
          </div>
        </div>
      </div>
    </div>
  );
};
