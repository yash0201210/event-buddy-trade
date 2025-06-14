
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminAuthWrapper } from "@/components/admin/AdminAuthWrapper";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Favourites from "./pages/Favourites";
import Event from "./pages/Event";
import TicketDetails from "./pages/TicketDetails";
import Messages from "./pages/Messages";
import MyTickets from "./pages/MyTickets";
import SellingHub from "./pages/SellingHub";
import Help from "./pages/Help";
import SellTickets from "./pages/SellTickets";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminVenues from "./pages/admin/AdminVenues";
import AdminUniversities from "./pages/admin/AdminUniversities";
import University from "./pages/University";
import Universities from "./pages/Universities";
import Venue from "./pages/Venue";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main site routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/event/:id" element={<Event />} />
            <Route path="/university/:id" element={<University />} />
            <Route path="/venue/:id" element={<Venue />} />
            <Route path="/ticket/:id" element={<TicketDetails />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/selling-hub" element={<SellingHub />} />
            <Route path="/help" element={<Help />} />
            <Route path="/sell-tickets" element={<SellTickets />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Admin authentication */}
            <Route path="/admin/auth" element={<AdminAuth />} />
            
            {/* Protected admin routes */}
            <Route path="/admin" element={
              <AdminAuthWrapper>
                <AdminLayout />
              </AdminAuthWrapper>
            }>
              <Route path="events" element={<AdminEvents />} />
              <Route path="venues" element={<AdminVenues />} />
              <Route path="universities" element={<AdminUniversities />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
