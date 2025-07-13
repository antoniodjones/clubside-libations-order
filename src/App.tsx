
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { VenueSearch } from "@/components/VenueSearch";
import Menu from "./pages/Menu";
import TrackOrder from "./pages/TrackOrder";
import BackOffice from "./pages/BackOffice";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen w-full flex">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              {/* Header with sidebar trigger */}
              <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center px-4">
                  <SidebarTrigger className="-ml-1" />
                </div>
              </header>
              
              {/* Main content */}
              <main className="flex-1 overflow-auto">
                <div className="container mx-auto px-4 py-6">
                  <Routes>
                    <Route path="/" element={<VenueSearch />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/backoffice" element={<BackOffice />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    {/* Placeholder routes for sidebar navigation */}
                    <Route path="/orders" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-muted-foreground">Orders - Coming Soon</h2></div>} />
                    <Route path="/favorites" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-muted-foreground">Favorites - Coming Soon</h2></div>} />
                    <Route path="/profile" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-muted-foreground">Profile - Coming Soon</h2></div>} />
                    <Route path="/settings" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-muted-foreground">Settings - Coming Soon</h2></div>} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
