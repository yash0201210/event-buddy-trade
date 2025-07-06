
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';

// Import pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Event from '@/pages/Event';
import SellTickets from '@/pages/SellTickets';
import MyTickets from '@/pages/MyTickets';
import Messages from '@/pages/Messages';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import Help from '@/pages/Help';
import SellingHub from '@/pages/SellingHub';
import SubmitEvent from '@/pages/SubmitEvent';
import NotFound from '@/pages/NotFound';

// Import other pages
import Favourites from '@/pages/Favourites';
import Notifications from '@/pages/Notifications';
import TicketDetails from '@/pages/TicketDetails';
import BuyerTransactionDetails from '@/pages/BuyerTransactionDetails';
import SellerTransactionDetails from '@/pages/SellerTransactionDetails';
import ListingDetails from '@/pages/ListingDetails';
import SellerProfile from '@/pages/SellerProfile';
import AllEvents from '@/pages/AllEvents';
import Universities from '@/pages/Universities';
import University from '@/pages/University';
import Venue from '@/pages/Venue';

// Admin pages
import AdminAuth from '@/pages/admin/AdminAuth';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminEvents from '@/pages/admin/AdminEvents';
import AdminEventRequests from '@/pages/admin/AdminEventRequests';
import AdminUniversities from '@/pages/admin/AdminUniversities';
import AdminVenues from '@/pages/admin/AdminVenues';
import AdminSettings from '@/pages/admin/AdminSettings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/event/:id" element={<Event />} />
            <Route path="/sell-tickets" element={<SellTickets />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/selling-hub" element={<SellingHub />} />
            <Route path="/submit-event" element={<SubmitEvent />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/ticket/:id" element={<TicketDetails />} />
            <Route path="/transaction/:id" element={<BuyerTransactionDetails />} />
            <Route path="/seller-transaction/:id" element={<SellerTransactionDetails />} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            <Route path="/seller/:id" element={<SellerProfile />} />
            <Route path="/events" element={<AllEvents />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/university/:id" element={<University />} />
            <Route path="/venue/:id" element={<Venue />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/event-requests" element={<AdminEventRequests />} />
            <Route path="/admin/universities" element={<AdminUniversities />} />
            <Route path="/admin/venues" element={<AdminVenues />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
