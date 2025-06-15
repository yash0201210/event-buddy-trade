
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UniversityPin {
  id: string;
  user_id: string;
  university_id: string;
  created_at: string;
}

export const useUniversityPins = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's pinned universities
  const { data: pinnedUniversities = [] } = useQuery({
    queryKey: ['user-pinned-universities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_university_pins')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UniversityPin[];
    },
    enabled: !!user,
  });

  // Pin university mutation
  const pinUniversityMutation = useMutation({
    mutationFn: async (universityId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_university_pins')
        .insert({
          user_id: user.id,
          university_id: universityId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-pinned-universities'] });
    },
  });

  // Unpin university mutation
  const unpinUniversityMutation = useMutation({
    mutationFn: async (universityId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('user_university_pins')
        .delete()
        .eq('user_id', user.id)
        .eq('university_id', universityId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-pinned-universities'] });
    },
  });

  const isPinned = (universityId: string) => {
    return pinnedUniversities.some(pin => pin.university_id === universityId);
  };

  const handlePinToggle = (universityId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!user) return;

    if (isPinned(universityId)) {
      unpinUniversityMutation.mutate(universityId);
    } else {
      pinUniversityMutation.mutate(universityId);
    }
  };

  return {
    pinnedUniversities,
    isPinned,
    handlePinToggle,
  };
};
