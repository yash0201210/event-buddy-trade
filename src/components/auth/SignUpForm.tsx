
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [countryCode, setCountryCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Password validation rules
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const countryCodes = [
    { code: '+44', country: 'GB', name: 'United Kingdom' },
    { code: '+1', country: 'US', name: 'United States' },
    { code: '+33', country: 'FR', name: 'France' },
    { code: '+49', country: 'DE', name: 'Germany' },
    { code: '+34', country: 'ES', name: 'Spain' },
    { code: '+39', country: 'IT', name: 'Italy' },
    { code: '+31', country: 'NL', name: 'Netherlands' },
    { code: '+32', country: 'BE', name: 'Belgium' },
    { code: '+41', country: 'CH', name: 'Switzerland' },
    { code: '+43', country: 'AT', name: 'Austria' },
    { code: '+46', country: 'SE', name: 'Sweden' },
    { code: '+47', country: 'NO', name: 'Norway' },
    { code: '+45', country: 'DK', name: 'Denmark' },
    { code: '+353', country: 'IE', name: 'Ireland' },
    { code: '+351', country: 'PT', name: 'Portugal' },
  ];

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

    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      
      // Use signUp with email confirmation disabled to trigger OTP instead
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            university: university,
            phone_number: fullPhoneNumber
          },
          emailRedirectTo: undefined // This ensures OTP is sent instead of link
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
          description: "We've sent you a 6-digit verification code to complete your registration.",
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
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex space-x-2">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.code} ({country.country})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="7123456789"
            className="flex-1"
          />
        </div>
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
