
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VerificationFormProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export const VerificationForm = ({ email, onVerificationComplete, onBack }: VerificationFormProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email'
      });

      if (error) {
        if (error.message.includes('expired')) {
          toast({
            title: "Code expired",
            description: "Your verification code has expired. Please request a new one.",
            variant: "destructive"
          });
        } else if (error.message.includes('invalid')) {
          toast({
            title: "Invalid code",
            description: "Please check your verification code and try again.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Email verified!",
          description: "Your account has been successfully verified.",
        });
        onVerificationComplete();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      } else {
        toast({
          title: "Code sent",
          description: "A new verification code has been sent to your email.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Check your email</h3>
        <p className="text-gray-600">
          We've sent a 6-digit verification code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleVerifyCode} className="space-y-4">
        <div>
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700"
          disabled={loading || code.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={handleResendCode}
          disabled={resending}
          className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          {resending ? 'Sending...' : "Didn't receive the code? Resend"}
        </button>
        
        <button
          type="button"
          onClick={onBack}
          className="block text-sm text-gray-600 hover:text-gray-700 mx-auto"
        >
          ← Back to sign up
        </button>
      </div>
    </div>
  );
};
