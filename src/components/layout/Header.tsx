import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, User, MessageCircle, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for unread messages
  const { data: hasUnreadMessages = false } = useQuery({
    queryKey: ['unread-messages', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id, updated_at')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (!conversations?.length) return false;

      // Check if any conversation has messages newer than user's last visit
      // For now, we'll just check if there are any messages in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      for (const conv of conversations) {
        const { data: recentMessages } = await supabase
          .from('messages')
          .select('sender_id')
          .eq('conversation_id', conv.id)
          .gte('created_at', oneHourAgo)
          .neq('sender_id', user.id);

        if (recentMessages?.length) return true;
      }
      
      return false;
    },
    enabled: !!user,
    refetchInterval: 30000, // Check every 30 seconds
  });

  const handleSellTickets = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to list tickets",
      });
      navigate('/auth');
      return;
    }
    navigate('/sell-tickets');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SD</span>
            </div>
            <span className="text-xl font-bold text-gray-900">socialdealr</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Browse Events
            </Link>
            <Link to="/help" className="text-gray-600 hover:text-gray-900">
              Help
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleSellTickets}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sell Tickets
            </Button>

            {user ? (
              <>
                <Link to="/messages" className="relative">
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4" />
                    {hasUnreadMessages && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </Button>
                </Link>

                <Link to="/favourites">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/my-tickets')}>
                      My Tickets
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/selling-hub')}>
                      Selling Hub
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
