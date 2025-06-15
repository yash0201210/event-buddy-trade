
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface University {
  id: string;
  name: string;
  city?: string;
  country: string;
  image_url?: string;
  image_position?: string;
}

interface UniversityFormData {
  name: string;
  city: string;
  country: string;
  image_url: string;
  image_position: string;
}

export const useUniversities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchUniversities = async () => {
    try {
      console.log('Fetching universities...');
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching universities:', error);
        throw error;
      }
      
      console.log('Fetched universities:', data);
      setUniversities(data || []);
    } catch (error: any) {
      console.error('Fetch universities error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch universities",
        variant: "destructive"
      });
    }
  };

  const saveUniversity = async (formData: UniversityFormData, editingUniversity?: University | null) => {
    setLoading(true);
    console.log('saveUniversity called with:', { formData, editingUniversity });

    try {
      const universityData = {
        name: formData.name.trim(),
        city: formData.city.trim() || null,
        country: formData.country.trim(),
        image_url: formData.image_url.trim() || null,
        image_position: formData.image_position || 'center center'
      };

      console.log('Prepared university data for save:', universityData);

      if (editingUniversity) {
        console.log('Updating university with ID:', editingUniversity.id);
        
        // First check if the university exists
        const { data: existingUni, error: checkError } = await supabase
          .from('universities')
          .select('id')
          .eq('id', editingUniversity.id)
          .single();

        if (checkError) {
          console.error('Error checking existing university:', checkError);
          throw new Error('University not found for update');
        }

        console.log('Found existing university:', existingUni);

        // Now update the university
        const { data, error } = await supabase
          .from('universities')
          .update(universityData)
          .eq('id', editingUniversity.id)
          .select()
          .single();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('University updated successfully:', data);
        
        toast({
          title: "University updated successfully!",
        });
      } else {
        console.log('Creating new university');
        
        const { data, error } = await supabase
          .from('universities')
          .insert(universityData)
          .select()
          .single();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('University created successfully:', data);
        
        toast({
          title: "University created successfully!",
        });
      }

      // Refresh the universities list
      await fetchUniversities();
    } catch (error: any) {
      console.error('Save university error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save university",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUniversity = async (universityId: string) => {
    if (!confirm('Are you sure you want to delete this university?')) return;

    try {
      console.log('Deleting university with ID:', universityId);
      
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', universityId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      console.log('University deleted successfully');
      
      toast({
        title: "University deleted successfully!",
      });
      
      await fetchUniversities();
    } catch (error: any) {
      console.error('Delete university error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete university",
        variant: "destructive"
      });
    }
  };

  return {
    universities,
    loading,
    fetchUniversities,
    saveUniversity,
    deleteUniversity
  };
};
