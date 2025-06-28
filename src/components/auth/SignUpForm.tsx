
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignUpFormProps {
  fullName: string;
  university: string;
  email: string;
  password: string;
  loading: boolean;
  onFullNameChange: (name: string) => void;
  onUniversityChange: (university: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SignUpForm = ({
  fullName,
  university,
  email,
  password,
  loading,
  onFullNameChange,
  onUniversityChange,
  onEmailChange,
  onPasswordChange,
  onSubmit
}: SignUpFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
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
          onChange={(e) => onUniversityChange(e.target.value)}
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
          onChange={(e) => onEmailChange(e.target.value)}
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
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          placeholder="••••••••"
          minLength={6}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
};
