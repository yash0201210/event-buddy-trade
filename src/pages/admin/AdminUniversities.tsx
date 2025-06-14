
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UniversityForm } from '@/components/admin/UniversityForm';
import { UniversityList } from '@/components/admin/UniversityList';
import { useUniversities } from '@/hooks/useUniversities';

interface University {
  id: string;
  name: string;
  city?: string;
  country: string;
  image_url?: string;
  image_position?: string;
}

const AdminUniversities = () => {
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const { universities, loading, fetchUniversities, saveUniversity, deleteUniversity } = useUniversities();

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleSubmit = async (formData: {
    name: string;
    city: string;
    country: string;
    image_url: string;
    image_position: string;
  }) => {
    console.log('AdminUniversities - handleSubmit called with:', formData);
    console.log('AdminUniversities - editing university:', editingUniversity);
    
    await saveUniversity(formData, editingUniversity);
    resetForm();
  };

  const resetForm = () => {
    setEditingUniversity(null);
    setShowForm(false);
  };

  const startEdit = (university: University) => {
    console.log('AdminUniversities - Starting to edit university:', university);
    setEditingUniversity(university);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingUniversity(null);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Create and manage universities</p>
        </div>
        <Button 
          onClick={handleAddNew}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add University
        </Button>
      </div>

      {showForm && (
        <UniversityForm
          university={editingUniversity}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          loading={loading}
        />
      )}

      <UniversityList
        universities={universities}
        onEdit={startEdit}
        onDelete={deleteUniversity}
      />
    </div>
  );
};

export default AdminUniversities;
