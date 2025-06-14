
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface TicketDetailsFormProps {
  formData: {
    section: string;
    row: string;
    seats: string;
    quantity: number;
    originalPrice: string;
    sellingPrice: string;
    description: string;
    isNegotiable: boolean;
  };
  onInputChange: (field: string, value: any) => void;
}

export const TicketDetailsForm = ({ formData, onInputChange }: TicketDetailsFormProps) => {
  return (
    <div className="space-y-6">
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Ticket Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="section">Section</Label>
            <Input
              id="section"
              value={formData.section}
              onChange={(e) => onInputChange('section', e.target.value)}
              placeholder="e.g. Lower Tier"
            />
          </div>
          <div>
            <Label htmlFor="row">Row</Label>
            <Input
              id="row"
              value={formData.row}
              onChange={(e) => onInputChange('row', e.target.value)}
              placeholder="e.g. M"
            />
          </div>
          <div>
            <Label htmlFor="seats">Seat Numbers</Label>
            <Input
              id="seats"
              value={formData.seats}
              onChange={(e) => onInputChange('seats', e.target.value)}
              placeholder="e.g. 12-13"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => onInputChange('quantity', parseInt(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="originalPrice">Original Price (£)</Label>
            <Input
              id="originalPrice"
              type="number"
              step="0.01"
              value={formData.originalPrice}
              onChange={(e) => onInputChange('originalPrice', e.target.value)}
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
              value={formData.sellingPrice}
              onChange={(e) => onInputChange('sellingPrice', e.target.value)}
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
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="Add any additional details about your tickets..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="negotiable"
              checked={formData.isNegotiable}
              onCheckedChange={(checked) => onInputChange('isNegotiable', checked)}
            />
            <Label htmlFor="negotiable">Open to offers</Label>
          </div>
        </div>
      </div>
    </div>
  );
};
