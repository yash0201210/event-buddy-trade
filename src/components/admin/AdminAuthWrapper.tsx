
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

export const AdminAuthWrapper = ({ children }: AdminAuthWrapperProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Admin access required",
        description: "Please log in to access the admin panel",
        variant: "destructive"
      });
      navigate('/admin/auth');
    }
  }, [user, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
