import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Event from '@/pages/Event';
import AllEvents from '@/pages/AllEvents';
import SellTickets from '@/pages/SellTickets';
import SubmitEvent from '@/pages/SubmitEvent';
import TicketDetails from '@/pages/TicketDetails';
import Favourites from '@/pages/Favourites';
import Messages from '@/pages/Messages';
import MyTickets from '@/pages/MyTickets';
import BuyerTransactionDetails from '@/pages/BuyerTransactionDetails';
import Settings from '@/pages/Settings';
import SellingHub from '@/pages/SellingHub';
import SellerTransactionDetails from '@/pages/SellerTransactionDetails';
import Universities from '@/pages/Universities';
import University from '@/pages/University';
import Venue from '@/pages/Venue';
import Help from '@/pages/Help';
import NotFound from '@/pages/NotFound';
import AdminAuth from '@/pages/admin/AdminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminAuthWrapper } from '@/components/admin/AdminAuthWrapper';
import AdminEvents from '@/pages/admin/AdminEvents';
import AdminEventRequests from '@/pages/admin/AdminEventRequests';
import AdminVenues from '@/pages/admin/AdminVenues';
import AdminUniversities from '@/pages/admin/AdminUniversities';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminSettings from '@/pages/admin/AdminSettings';
import './App.css';
import SellerProfile from './pages/SellerProfile';

const queryClient = new QueryClient();

const AppRoutes = () => {
  useScrollToTop();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/events" element={<AllEvents />} />
      <Route path="/event/:id" element={<Event />} />
      <Route path="/sell-tickets" element={<SellTickets />} />
      <Route path="/submit-event" element={<SubmitEvent />} />
      <Route path="/ticket/:id" element={<TicketDetails />} />
      <Route path="/favourites" element={<Favourites />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/my-tickets" element={<MyTickets />} />
      <Route path="/buyer-transaction/:id" element={<BuyerTransactionDetails />} />
      <Route path="/selling-hub" element={<SellingHub />} />
      <Route path="/seller-transaction/:id" element={<SellerTransactionDetails />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/universities" element={<Universities />} />
      <Route path="/university/:id" element={<University />} />
      <Route path="/venue/:id" element={<Venue />} />
      <Route path="/help" element={<Help />} />
      
      {/* Admin Routes */}
      <Route path="/admin/auth" element={<AdminAuth />} />
      <Route path="/admin/*" element={
        <AdminAuthWrapper>
          <AdminLayout />
        </AdminAuthWrapper>
      }>
        <Route path="events" element={<AdminEvents />} />
        <Route path="event-requests" element={<AdminEventRequests />} />
        <Route path="venues" element={<AdminVenues />} />
        <Route path="universities" element={<AdminUniversities />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      
      <Route path="/seller/:sellerId" element={<SellerProfile />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
