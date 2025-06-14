
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSellTicketsClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/sell-tickets');
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      navigate('/');
    }
  };

  return (
    <header className="bg-red-600 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            socialdealr
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search events, artists, venues..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="pl-10 bg-white text-gray-900 border-0 focus:ring-2 focus:ring-red-300" 
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link to="/favourites" className="hover:text-red-200 transition-colors text-sm">
              Favourites
            </Link>
            <Link to="/help" className="hover:text-red-200 transition-colors text-sm">
              Help
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white hover:bg-white text-zinc-800"
              onClick={handleSellTicketsClick}
            >
              List Tickets
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white text-red-600 hover:bg-gray-100"
              onClick={handleSellTicketsClick}
            >
              Sell Tickets
            </Button>
            
            {loading ? (
              <div className="h-9 w-9 bg-red-500 rounded animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm">Hello, {user.email?.split('@')[0]}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-white hover:bg-red-500">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
