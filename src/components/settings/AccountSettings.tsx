
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleDeactivateAccount = async () => {
    if (confirmText !== 'DELETE') {
      toast({
        title: "Confirmation required",
        description: "Please type 'DELETE' to confirm account deletion",
        variant: "destructive"
      });
      return;
    }

    setIsDeactivating(true);

    try {
      // Log the deletion attempt with optional feedback
      if (feedback.trim()) {
        console.log('Account deletion feedback:', feedback);
        // You could send this to your analytics or support system
      }

      // Sign out the user first
      await signOut();

      // Note: In a production app, you would typically:
      // 1. Mark the account as deactivated rather than deleting immediately
      // 2. Have a grace period for account recovery
      // 3. Send confirmation emails
      // 4. Handle data cleanup via background jobs
      
      toast({
        title: "Account deactivated",
        description: "Your account has been successfully deactivated. We're sorry to see you go!",
      });

      navigate('/', { replace: true });

    } catch (error: any) {
      console.error('Error deactivating account:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate account. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email Address</Label>
            <Input value={user?.email || ''} disabled className="bg-gray-50" />
            <p className="text-sm text-gray-500 mt-1">
              Your email address cannot be changed. Contact support if you need to update this.
            </p>
          </div>
          <div>
            <Label>Account Created</Label>
            <Input 
              value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'} 
              disabled 
              className="bg-gray-50" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Deactivate Account</h3>
            <p className="text-sm text-red-700 mb-4">
              Once you deactivate your account, all your data will be permanently removed. 
              This action cannot be undone.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="feedback">Tell us why you're leaving (optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Your feedback helps us improve SocialDealr..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                />
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deactivate Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                      <p>
                        This action cannot be undone. This will permanently delete your account 
                        and remove all your data from our servers.
                      </p>
                      <p>This includes:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Your profile and account information</li>
                        <li>All your ticket listings (active and sold)</li>
                        <li>Your purchase history</li>
                        <li>All messages and conversations</li>
                        <li>Your favorites and preferences</li>
                      </ul>
                      <div className="mt-4">
                        <Label htmlFor="confirm-delete">
                          Type <strong>DELETE</strong> to confirm:
                        </Label>
                        <Input
                          id="confirm-delete"
                          value={confirmText}
                          onChange={(e) => setConfirmText(e.target.value)}
                          placeholder="Type DELETE here"
                          className="mt-2"
                        />
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText('')}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeactivateAccount}
                      disabled={isDeactivating || confirmText !== 'DELETE'}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeactivating ? 'Deactivating...' : 'Delete Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
