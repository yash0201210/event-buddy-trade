
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const PasswordSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
      console.error('Password update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof passwords) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswords(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handleInputChange('newPassword')}
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              placeholder="Confirm new password"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
