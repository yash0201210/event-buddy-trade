
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { UniversityImageUpload } from '@/components/admin/UniversityImageUpload';

interface University {
  id: string;
  name: string;
  city?: string;
  country: string;
  image_url?: string;
  image_position?: string;
}

const AdminUniversities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: 'UK',
    image_url: '',
    image_position: 'center center'
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name');

      if (error) throw error;
      setUniversities(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch universities",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const universityData = {
        name: formData.name,
        city: formData.city || null,
        country: formData.country,
        image_url: formData.image_url || null,
        image_position: formData.image_position || 'center center'
      };

      if (editingUniversity) {
        const { error } = await supabase
          .from('universities')
          .update(universityData)
          .eq('id', editingUniversity.id);

        if (error) throw error;
        
        toast({
          title: "University updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from('universities')
          .insert(universityData);

        if (error) throw error;
        
        toast({
          title: "University created successfully!",
        });
      }

      resetForm();
      fetchUniversities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save university",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (universityId: string) => {
    if (!confirm('Are you sure you want to delete this university?')) return;

    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', universityId);

      if (error) throw error;
      
      toast({
        title: "University deleted successfully!",
      });
      
      fetchUniversities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete university",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      country: 'UK',
      image_url: '',
      image_position: 'center center'
    });
    setEditingUniversity(null);
    setShowForm(false);
  };

  const startEdit = (university: University) => {
    setFormData({
      name: university.name,
      city: university.city || '',
      country: university.country,
      image_url: university.image_url || '',
      image_position: university.image_position || 'center center'
    });
    setEditingUniversity(university);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Create and manage universities</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add University
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingUniversity ? 'Edit University' : 'Create New University'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <UniversityImageUpload 
                imageUrl={formData.image_url}
                onImageChange={(url) => setFormData({...formData, image_url: url})}
                imagePosition={formData.image_position}
                onPositionChange={(position) => setFormData({...formData, image_position: position})}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">University Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingUniversity ? 'Update University' : 'Create University')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEdit(university)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(university.id)}
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
    </div>
  );
};

export default AdminUniversities;
