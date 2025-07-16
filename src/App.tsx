
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import ProductDetail from "./pages/ProductDetail";
import TrackOrder from "./pages/TrackOrder";
import BackOffice from "./pages/BackOffice";
import NotFound from "./pages/NotFound";
import RewardsInfo from "./pages/RewardsInfo";
import Loyalty from "./pages/Loyalty";
import Auth from "./pages/Auth";
import CheckoutPage from "./pages/CheckoutPage";
import CustomerProfilePage from "./pages/CustomerProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/menu/product/:id" element={<ProductDetail />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/rewards-info" element={<RewardsInfo />} />
          <Route path="/rewards" element={<Loyalty />} />
          <Route path="/customer-profile" element={<CustomerProfilePage />} />
          <Route path="/profile" element={<CustomerProfilePage />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/backoffice" element={<BackOffice />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
