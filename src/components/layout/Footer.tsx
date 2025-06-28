
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Instagram, Youtube } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    // Handle email submission here
    setEmail('');
  };

  const handleInviteFriends = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SocialDealr - Student Ticket Marketplace',
        text: 'Check out SocialDealr - the best place to buy and sell student event tickets!',
        url: window.location.origin,
      }).catch((error) => {
        console.log('Error sharing:', error);
        // Fallback to copying URL to clipboard
        navigator.clipboard.writeText(window.location.origin);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard!');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
  };

  return (
    <footer className="bg-red-600 text-white">
      {/* Newsletter section */}
      <div className="bg-red-700 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            The Latest Events and Deals Straight to your Inbox
          </h2>
          
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-b-2 border-white border-t-0 border-l-0 border-r-0 rounded-none text-white placeholder-white/80 focus:border-white focus-visible:ring-0"
                required
              />
            </div>
            <Button 
              type="submit"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-red-600 rounded-full px-8"
            >
              Join the List
            </Button>
          </form>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Secure */}
            <div>
              <h3 className="text-xl font-bold mb-4">Secure</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={scrollToTop} 
                    className="hover:text-red-200 transition-colors text-left"
                  >
                    Buy Tickets
                  </button>
                </li>
                <li><Link to="/my-tickets" className="hover:text-red-200 transition-colors">My Purchases</Link></li>
              </ul>
            </div>

            {/* Sell */}
            <div>
              <h3 className="text-xl font-bold mb-4">Sell</h3>
              <ul className="space-y-2">
                <li><Link to="/sell-tickets" className="hover:text-red-200 transition-colors">List Tickets</Link></li>
                <li><Link to="/submit-event" className="hover:text-red-200 transition-colors">Submit A New Event</Link></li>
                <li><Link to="/selling-hub" className="hover:text-red-200 transition-colors">My Listings</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-xl font-bold mb-4">Social</h3>
              <ul className="space-y-2">
                <li><Link to="/settings" className="hover:text-red-200 transition-colors">My Account</Link></li>
                <li>
                  <button 
                    onClick={handleInviteFriends} 
                    className="hover:text-red-200 transition-colors text-left"
                  >
                    Invite Friends
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="hover:text-red-200 transition-colors">Submit Support Query</Link></li>
                <li><Link to="/help" className="hover:text-red-200 transition-colors">Give Us Feedback</Link></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.instagram.com/socialdealr/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-red-200 transition-colors flex items-center justify-center md:justify-start"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.tiktok.com/@socialdealr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-red-200 transition-colors flex items-center justify-center md:justify-start"
                  >
                    <Youtube className="h-4 w-4 mr-2" />
                    Tiktok
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-red-500 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-red-200 mb-4 md:mb-0">
            © 2024 SocialDealr. All rights reserved.
          </div>
          
          {/* Logo */}
          <div className="text-2xl font-bold">
            socialdealr
          </div>
        </div>
      </div>
    </footer>
  );
};
