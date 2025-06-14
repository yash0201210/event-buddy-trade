
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';

export const ImageUpload = () => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Upload Ticket Images</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 mb-2">Upload clear photos of your tickets</p>
        <p className="text-xs text-gray-400">PNG, JPG up to 5MB each</p>
        <Button type="button" variant="outline" className="mt-2">
          <Camera className="h-4 w-4 mr-2" />
          Choose Files
        </Button>
      </div>
    </div>
  );
};
