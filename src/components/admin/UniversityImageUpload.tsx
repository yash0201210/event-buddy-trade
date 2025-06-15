
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

interface UniversityImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  imagePosition?: string;
  onPositionChange?: (position: string) => void;
}

export const UniversityImageUpload = ({ 
  imageUrl, 
  onImageChange, 
  imagePosition = 'center center',
  onPositionChange 
}: UniversityImageUploadProps) => {
  const [preview, setPreview] = useState(imageUrl);
  const [position, setPosition] = useState(imagePosition);
  const [urlInput, setUrlInput] = useState(imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with imageUrl prop when it changes
  useEffect(() => {
    console.log('UniversityImageUpload - imageUrl prop changed:', imageUrl);
    setPreview(imageUrl);
    setUrlInput(imageUrl);
  }, [imageUrl]);

  // Sync position with imagePosition prop when it changes
  useEffect(() => {
    console.log('UniversityImageUpload - imagePosition prop changed:', imagePosition);
    setPosition(imagePosition);
  }, [imagePosition]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('UniversityImageUpload - File selected:', file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('UniversityImageUpload - File read, calling onImageChange');
        setPreview(result);
        setUrlInput(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInput = (url: string) => {
    console.log('UniversityImageUpload - URL input changed:', url);
    setUrlInput(url);
    setPreview(url);
    onImageChange(url);
  };

  const handlePositionChange = (newPosition: string) => {
    console.log('UniversityImageUpload - Position changed:', newPosition);
    setPosition(newPosition);
    if (onPositionChange) {
      onPositionChange(newPosition);
    }
  };

  const clearImage = () => {
    console.log('UniversityImageUpload - Clearing image');
    setPreview('');
    setUrlInput('');
    onImageChange('');
    setPosition('center center');
    if (onPositionChange) {
      onPositionChange('center center');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const positionOptions = [
    { value: 'center center', label: 'Center' },
    { value: 'top center', label: 'Top Center' },
    { value: 'bottom center', label: 'Bottom Center' },
    { value: 'center left', label: 'Center Left' },
    { value: 'center right', label: 'Center Right' },
    { value: 'top left', label: 'Top Left' },
    { value: 'top right', label: 'Top Right' },
    { value: 'bottom left', label: 'Bottom Left' },
    { value: 'bottom right', label: 'Bottom Right' },
  ];

  console.log('UniversityImageUpload - Rendering with preview:', preview ? 'has image' : 'no image');

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
              style={{ objectPosition: position }}
              onError={(e) => {
                console.log('UniversityImageUpload - Image failed to load:', preview);
                setPreview('');
                setUrlInput('');
              }}
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
            value={urlInput}
            onChange={(e) => handleUrlInput(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Image Position Controls */}
        {preview && (
          <div>
            <Label htmlFor="image-position" className="text-sm">Image Position</Label>
            <select
              id="image-position"
              value={position}
              onChange={(e) => handlePositionChange(e.target.value)}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {positionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
