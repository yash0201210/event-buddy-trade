
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageSquare, User, Settings, LogOut, Plus, Calendar, Search, TrendingUp, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { hasUnreadMessages, unreadCount } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    
    try {
      console.log('Starting sign out process...');
      await signOut();
      
      toast({
        title: "Signed out successfully",
      });
      
      navigate('/', { replace: true });
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SD</span>
            </div>
            <span className="font-bold text-xl text-gray-900">socialdealr</span>
          </Link>

          {/* Search Bar - only show on non-home pages */}
          {!isHomePage && (
            <div className="flex-1 max-w-sm mx-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex items-center">
                <div className="flex items-center flex-1 px-3 py-2">
                  <Search className="h-4 w-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
                      }
                    }}
                    className="border-0 bg-transparent text-gray-900 placeholder-gray-500 text-sm focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                <Button
                  onClick={() => navigate('/sell-tickets')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Sell Tickets
                </Button>

                <Link
                  to="/favourites"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Heart className="h-5 w-5" />
                </Link>

                <Link
                  to="/messages"
                  className="text-gray-600 hover:text-gray-900 relative"
                >
                  <MessageSquare className="h-5 w-5" />
                  {hasUnreadMessages && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.email || ''} />
                        <AvatarFallback className="bg-red-100 text-red-600">
                          {getUserInitials(user.email || '')}
                        </AvatarFallback>
                      </Avatar>
                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => navigate('/notifications')}>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {unreadCount}
                        </span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/my-tickets')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>My Tickets</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/selling-hub')}>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      <span>Selling Hub</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/submit-event')}>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Submit Event</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Get Started
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
