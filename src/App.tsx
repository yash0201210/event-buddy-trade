
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Event from "./pages/Event";
import TicketDetails from "./pages/TicketDetails";
import SellTickets from "./pages/SellTickets";
import MyTickets from "./pages/MyTickets";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Favourites from "./pages/Favourites";
import SellingHub from "./pages/SellingHub";
import ListingDetails from "./pages/ListingDetails";
import BuyerTransactionDetails from "./pages/BuyerTransactionDetails";
import SellerTransactionDetails from "./pages/SellerTransactionDetails";
import SellerProfile from "./pages/SellerProfile";
import Universities from "./pages/Universities";
import University from "./pages/University";
import Venue from "./pages/Venue";
import AllEvents from "./pages/AllEvents";
import SubmitEvent from "./pages/SubmitEvent";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

// Admin routes
import AdminAuth from "./pages/admin/AdminAuth";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminEventRequests from "./pages/admin/AdminEventRequests";
import AdminUniversities from "./pages/admin/AdminUniversities";
import AdminVenues from "./pages/admin/AdminVenues";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/event/:id" element={<Event />} />
            <Route path="/ticket/:id" element={<TicketDetails />} />
            <Route path="/sell-tickets" element={<SellTickets />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/selling-hub" element={<SellingHub />} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            <Route path="/buyer-transaction/:id" element={<BuyerTransactionDetails />} />
            <Route path="/seller-transaction/:ticketId" element={<SellerTransactionDetails />} />
            <Route path="/seller/:id" element={<SellerProfile />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/university/:id" element={<University />} />
            <Route path="/venue/:id" element={<Venue />} />
            <Route path="/events" element={<AllEvents />} />
            <Route path="/submit-event" element={<SubmitEvent />} />
            <Route path="/help" element={<Help />} />
            
            {/* Admin Routes */}
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/event-requests" element={<AdminEventRequests />} />
            <Route path="/admin/universities" element={<AdminUniversities />} />
            <Route path="/admin/venues" element={<AdminVenues />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
