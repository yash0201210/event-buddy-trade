
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

interface SignUpFormProps {
  onSignUpSuccess: (email: string) => void;
}

export const SignUpForm = ({ onSignUpSuccess }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Password validation rules
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast({
        title: "Password requirements not met",
        description: "Please ensure your password meets all security requirements.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            university: university
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a verification code to complete your registration.",
        });
        onSignUpSuccess(email);
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

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`flex items-center justify-center w-4 h-4 rounded-sm border ${
        met ? 'bg-green-500 border-green-500' : 'border-gray-300'
      }`}>
        {met ? (
          <Check className="w-3 h-3 text-white" />
        ) : (
          <X className="w-3 h-3 text-gray-400" />
        )}
      </div>
      <span className={met ? 'text-green-600' : 'text-gray-500'}>
        {text}
      </span>
    </div>
  );

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="John Smith"
        />
      </div>
      <div>
        <Label htmlFor="university">University</Label>
        <Input
          id="university"
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          required
          placeholder="University of Oxford"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your.email@university.ac.uk"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
        
        {/* Password Requirements */}
        <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
          <RequirementItem 
            met={passwordRequirements.minLength} 
            text="At least 8 characters" 
          />
          <RequirementItem 
            met={passwordRequirements.hasUppercase} 
            text="At least one uppercase letter" 
          />
          <RequirementItem 
            met={passwordRequirements.hasSpecialChar} 
            text="At least one special character (!@#$%^&*)" 
          />
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={loading || !isPasswordValid}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
};
