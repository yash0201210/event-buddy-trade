
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { VerificationForm } from '@/components/auth/VerificationForm';

const Auth = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (!loading && user) {
      console.log('User already authenticated, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSignUpSuccess = (email: string) => {
    setPendingEmail(email);
    setShowVerification(true);
  };

  const handleVerificationComplete = () => {
    setShowVerification(false);
    setPendingEmail('');
    navigate('/', { replace: true });
  };

  const handleBackToSignUp = () => {
    setShowVerification(false);
    setPendingEmail('');
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12 px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render the auth form if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {showVerification ? 'Verify Your Email' : 'Get Started'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showVerification ? (
                <VerificationForm
                  email={pendingEmail}
                  onVerificationComplete={handleVerificationComplete}
                  onBack={handleBackToSignUp}
                />
              ) : (
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <SignInForm />
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <SignUpForm onSignUpSuccess={handleSignUpSuccess} />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
