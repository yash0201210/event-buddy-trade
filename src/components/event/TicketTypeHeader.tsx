
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TicketGroup {
  type: string;
  tickets: any[];
  minPrice: number;
  totalQuantity: number;
}

interface TicketTypeHeaderProps {
  group: TicketGroup;
  isExpanded: boolean;
  onToggle: () => void;
}

export const TicketTypeHeader = ({ group, isExpanded, onToggle }: TicketTypeHeaderProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow border border-gray-200">
      <CardContent className="p-0">
        <div 
          className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 transition-colors"
          onClick={onToggle}
        >
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {group.type}
              </h3>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  From £{group.minPrice}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-gray-100">
                  {group.totalQuantity} available
                </Badge>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
