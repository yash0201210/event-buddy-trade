
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';

interface University {
  id: string;
  name: string;
  city?: string;
  country: string;
  image_url?: string;
  image_position?: string;
}

interface UniversityListProps {
  universities: University[];
  onEdit: (university: University) => void;
  onDelete: (universityId: string) => void;
}

export const UniversityList = ({ universities, onEdit, onDelete }: UniversityListProps) => {
  return (
    <div className="grid gap-4">
      {universities.map((university) => (
        <Card key={university.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* University Image Preview */}
                <div className="w-16 h-16 rounded-full border-2 border-blue-400 overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-300 flex-shrink-0">
                  {university.image_url ? (
                    <img 
                      src={university.image_url} 
                      alt={university.name}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: university.image_position || 'center center' }}
                    />
                  ) : (
                    <span className="text-blue-600 text-xs">No Image</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {university.name}
                  </h3>
                  <div className="text-gray-600 space-y-1">
                    <p><strong>Country:</strong> {university.country}</p>
                    {university.city && <p><strong>City:</strong> {university.city}</p>}
                    {university.image_url && (
                      <p className="text-xs text-gray-500">
                        <strong>Image:</strong> {university.image_url.substring(0, 50)}...
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(university)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(university.id)}
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
  );
};
