
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { VirtuosityPrivyProvider } from "@/providers/PrivyProvider";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { GoogleFitProvider } from "@/providers/GoogleFitProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DashboardAziende from "./pages/DashboardAziende";
import Exchange from "./pages/Exchange";
import About from "./pages/About";
import Comuni from "./pages/Comuni";
import Report from "./pages/Report";
import NotFound from "./pages/NotFound";
import DigitalWarrantyUpload from "./pages/DigitalWarrantyUpload";
import WelfareManagement from "./pages/WelfareManagement";
import RewardsManagement from "./pages/RewardsManagement";
import WelfareUpload from "./pages/WelfareUpload";
import AuthTest from "./pages/AuthTest";
import SupabaseTest from "./components/SupabaseTest";
import GoogleFitConnect from "./components/GoogleFitConnect";
import GoogleSignInTest from "./components/GoogleSignInTest";
import ActivityList from "./components/ActivityList";
import MarketplaceTest from "./pages/MarketplaceTest";

const App = () => (
  <VirtuosityPrivyProvider>
    <SupabaseProvider>
      <GoogleFitProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-aziende" element={<DashboardAziende />} />
            <Route path="/exchange" element={<Exchange />} />
            <Route path="/marketplace" element={<Exchange />} />
            <Route path="/comuni" element={<Comuni />} />
            <Route path="/about" element={<About />} />
            <Route path="/report" element={<Report />} />
            <Route path="/auth-test" element={<AuthTest />} />
            <Route path="/supabase-test" element={<SupabaseTest />} />
            <Route path="/activities" element={<ActivityList />} />
            <Route path="/googlefit-test" element={<GoogleFitConnect />} />
            <Route path="/google-signin-test" element={<GoogleSignInTest />} />
            <Route path="/digital-warranty-upload" element={<DigitalWarrantyUpload />} />
            <Route path="/welfare-management" element={<WelfareManagement />} />
            <Route path="/rewards-management" element={<RewardsManagement />} />
            <Route path="/welfare-upload" element={<WelfareUpload />} />
            <Route path="/marketplace-test" element={<MarketplaceTest />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
      </GoogleFitProvider>
    </SupabaseProvider>
  </VirtuosityPrivyProvider>
);

export default App;
