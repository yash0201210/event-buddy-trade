
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AuthHeader } from './AuthHeader';

interface VerificationFormProps {
  pendingEmail: string;
  verificationCode: string;
  loading: boolean;
  onVerificationCodeChange: (code: string) => void;
  onVerifyCode: (e: React.FormEvent) => void;
  onResendCode: () => void;
  onBackToSignUp: () => void;
}

export const VerificationForm = ({
  pendingEmail,
  verificationCode,
  loading,
  onVerificationCodeChange,
  onVerifyCode,
  onResendCode,
  onBackToSignUp
}: VerificationFormProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <AuthHeader 
          title="Verify Your Email"
          subtitle={`Enter the verification code sent to ${pendingEmail}`}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Email Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onVerifyCode} className="space-y-4">
              <div>
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => onVerificationCodeChange(e.target.value)}
                  required
                  placeholder="Enter verification code"
                  maxLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Account'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
                onClick={onResendCode}
                disabled={loading}
              >
                Resend Code
              </Button>
              <Button 
                type="button" 
                variant="ghost"
                className="w-full"
                onClick={onBackToSignUp}
              >
                Back to Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
