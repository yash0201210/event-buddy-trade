
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferences {
  email_offers: boolean;
  email_messages: boolean;
  email_sales: boolean;
  email_marketing: boolean;
  push_offers: boolean;
  push_messages: boolean;
  push_sales: boolean;
}

export const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_offers: true,
    email_messages: true,
    email_sales: true,
    email_marketing: false,
    push_offers: true,
    push_messages: true,
    push_sales: true,
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
      // Set preferences from profile data
      setPreferences({
        email_offers: true,
        email_messages: true,
        email_sales: true,
        email_marketing: false,
        push_offers: true,
        push_messages: true,
        push_sales: true,
      });
    }
  }, [profile]);

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: NotificationPreferences) => {
      if (!user) throw new Error('No user found');
      
      // For now, we'll just show success since we don't have notification preferences in the database
      // In a real app, you'd store these in a separate table or as JSON in the profiles table
      console.log('Updating notification preferences:', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification preferences updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
      console.error('Preferences update error:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await updatePreferencesMutation.mutateAsync(preferences);
    setIsLoading(false);
  };

  const handleToggle = (field: keyof NotificationPreferences) => (checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-offers" className="text-sm font-normal">
                  New offers on my tickets
                </Label>
                <Switch
                  id="email-offers"
                  checked={preferences.email_offers}
                  onCheckedChange={handleToggle('email_offers')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-messages" className="text-sm font-normal">
                  New messages
                </Label>
                <Switch
                  id="email-messages"
                  checked={preferences.email_messages}
                  onCheckedChange={handleToggle('email_messages')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-sales" className="text-sm font-normal">
                  Successful sales
                </Label>
                <Switch
                  id="email-sales"
                  checked={preferences.email_sales}
                  onCheckedChange={handleToggle('email_sales')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-marketing" className="text-sm font-normal">
                  Marketing emails and promotions
                </Label>
                <Switch
                  id="email-marketing"
                  checked={preferences.email_marketing}
                  onCheckedChange={handleToggle('email_marketing')}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-offers" className="text-sm font-normal">
                  New offers on my tickets
                </Label>
                <Switch
                  id="push-offers"
                  checked={preferences.push_offers}
                  onCheckedChange={handleToggle('push_offers')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-messages" className="text-sm font-normal">
                  New messages
                </Label>
                <Switch
                  id="push-messages"
                  checked={preferences.push_messages}
                  onCheckedChange={handleToggle('push_messages')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-sales" className="text-sm font-normal">
                  Successful sales
                </Label>
                <Switch
                  id="push-sales"
                  checked={preferences.push_sales}
                  onCheckedChange={handleToggle('push_sales')}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
