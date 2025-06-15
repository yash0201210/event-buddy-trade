
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { EventFormData } from '@/types/event';

interface EventTicketTypesProps {
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  newTicketType: string;
  setNewTicketType: React.Dispatch<React.SetStateAction<string>>;
}

export const EventTicketTypes = ({
  formData,
  setFormData,
  newTicketType,
  setNewTicketType
}: EventTicketTypesProps) => {
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
  );
};
