
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UniversityImageUpload } from '@/components/admin/UniversityImageUpload';

interface University {
  id: string;
  name: string;
  city?: string;
  country: string;
  image_url?: string;
  image_position?: string;
}

interface UniversityFormProps {
  university: University | null;
  onSubmit: (formData: {
    name: string;
    city: string;
    country: string;
    image_url: string;
    image_position: string;
  }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const UniversityForm = ({ university, onSubmit, onCancel, loading }: UniversityFormProps) => {
  const [formData, setFormData] = React.useState({
    name: university?.name || '',
    city: university?.city || '',
    country: university?.country || 'UK',
    image_url: university?.image_url || '',
    image_position: university?.image_position || 'center center'
  });

  React.useEffect(() => {
    if (university) {
      console.log('University form - Setting form data for:', university);
      setFormData({
        name: university.name,
        city: university.city || '',
        country: university.country,
        image_url: university.image_url || '',
        image_position: university.image_position || 'center center'
      });
    }
  }, [university]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('University form - Submitting form data:', formData);
    await onSubmit(formData);
  };

  const handleImageChange = (url: string) => {
    console.log('University form - Image URL changed to:', url);
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  const handlePositionChange = (position: string) => {
    console.log('University form - Image position changed to:', position);
    setFormData(prev => ({ ...prev, image_position: position }));
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{university ? 'Edit University' : 'Create New University'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <UniversityImageUpload 
            imageUrl={formData.image_url}
            onImageChange={handleImageChange}
            imagePosition={formData.image_position}
            onPositionChange={handlePositionChange}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">University Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : (university ? 'Update University' : 'Create University')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
