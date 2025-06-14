
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const ProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    phoneNumber: ''
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        email: profile.email || '',
        university: profile.university || '',
        phoneNumber: profile.phone_number || ''
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user) throw new Error('No user found');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          university: data.university,
          phone_number: data.phoneNumber
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      console.error('Profile update error:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await updateProfileMutation.mutateAsync(formData);
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                placeholder="Email cannot be changed"
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                value={formData.university}
                onChange={handleInputChange('university')}
                placeholder="Enter your university"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange('phoneNumber')}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
