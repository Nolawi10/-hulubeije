import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Marketing from "./pages/Marketing";
import CaptionGenerator from "./pages/CaptionGenerator";
import Sales from "./pages/Sales";
import AddSale from "./pages/AddSale";
import Learn from "./pages/Learn";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isOnboarded } = useAppStore();

  return (
    <Routes>
      <Route path="/" element={isOnboarded ? <Navigate to="/dashboard" /> : <Onboarding />} />
      <Route path="/dashboard" element={isOnboarded ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/marketing" element={<Marketing />} />
      <Route path="/marketing/caption" element={<CaptionGenerator />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/sales/add" element={<AddSale />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
