
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Star, MessageCircle, TrendingUp, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About SocialDealr
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            The trusted platform connecting university students to buy and sell event tickets safely and securely
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We're revolutionizing how university students buy and sell event tickets. No more unreliable WhatsApp groups, 
              sketchy Facebook posts, or worrying about getting scammed. SocialDealr provides a secure, verified platform 
              where students can confidently trade tickets for concerts, sports events, society gatherings, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Safe & Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Every transaction is protected with verified users, secure payment processing, 
                  and our 100% authenticity guarantee.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <Users className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Student-Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built specifically for university students, by students who understand 
                  the unique challenges of campus life and event ticketing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* The Problem Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why We Built SocialDealr</h2>
          
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <p className="text-lg text-gray-700 mb-6">
              As university students ourselves, we experienced firsthand the frustration of trying to buy or sell event tickets:
            </p>
            
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3">•</span>
                <span>Getting scammed on Facebook Marketplace or WhatsApp groups</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3">•</span>
                <span>No way to verify if tickets were genuine until it was too late</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3">•</span>
                <span>Unsafe meetups with strangers to exchange tickets and cash</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3">•</span>
                <span>Missing out on events because reliable ticket sources were hard to find</span>
              </li>
            </ul>

            <p className="text-lg text-gray-700 mt-6">
              We knew there had to be a better way. That's why we created SocialDealr - a platform designed 
              specifically for the student community, with safety and authenticity at its core.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How SocialDealr Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardHeader>
                <Star className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Verified Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All sellers are verified university students with authentic tickets 
                  checked by our advanced verification system.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Secure Messaging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Communicate safely through our in-app messaging system with 
                  built-in transaction management and dispute resolution.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Fair Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No hidden fees or inflated prices. Our platform ensures 
                  fair market rates for all university events.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-600 text-white rounded-lg p-12">
            <Heart className="h-16 w-16 mx-auto mb-6 text-red-200" />
            <h2 className="text-3xl font-bold mb-4">Join the SocialDealr Community</h2>
            <p className="text-xl text-red-100 mb-8">
              Thousands of students are already buying and selling tickets safely on our platform
            </p>
            <div className="space-x-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white text-red-600 hover:bg-gray-100"
                onClick={() => navigate('/auth')}
              >
                Get Started Today
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-red-700"
                onClick={() => navigate('/help')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
