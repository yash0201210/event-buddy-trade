
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

interface UniversityImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export const UniversityImageUpload = ({ imageUrl, onImageChange }: UniversityImageUploadProps) => {
  const [preview, setPreview] = useState(imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInput = (url: string) => {
    setPreview(url);
    onImageChange(url);
  };

  const clearImage = () => {
    setPreview('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label>University Image</Label>
      
      {/* Preview Circle */}
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 rounded-full border-4 border-blue-400 overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-300">
          {preview ? (
            <img 
              src={preview} 
              alt="University preview"
              className="w-full h-full object-cover"
              onError={() => setPreview('')}
            />
          ) : (
            <span className="text-blue-600 text-xs text-center">No Image</span>
          )}
        </div>
        
        {preview && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={clearImage}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      {/* Upload Options */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="image-upload" className="text-sm">Upload Image File</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button 
              type="button"
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Choose File</span>
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="image-url" className="text-sm">Or Enter Image URL</Label>
          <Input
            id="image-url"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={preview}
            onChange={(e) => handleUrlInput(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
