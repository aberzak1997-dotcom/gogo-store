import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/storefront/HomePage";
import ProductDetailsPage from "./pages/storefront/ProductDetailsPage";
import CheckoutPage from "./pages/storefront/CheckoutPage";
import ProductsPage from "./pages/storefront/ProductsPage";
import NewArrivalsPage from "./pages/storefront/NewArrivalsPage";
import BestSellersPage from "./pages/storefront/BestSellersPage";
import DealsPage from "./pages/storefront/DealsPage";
import ContactPage from "./pages/storefront/ContactPage";
import FAQPage from "./pages/storefront/FAQPage";
import AboutPage from "./pages/storefront/AboutPage";
import ShippingPage from "./pages/storefront/ShippingPage";
import ReturnsPage from "./pages/storefront/ReturnsPage";
import WarrantyPage from "./pages/storefront/WarrantyPage";
import PrivacyPolicyPage from "./pages/storefront/PrivacyPolicyPage";
import TermsPage from "./pages/storefront/TermsPage";
import CareersPage from "./pages/storefront/CareersPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminLayout from "./components/admin/AdminLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StoreProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Storefront */}
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/new-arrivals" element={<NewArrivalsPage />} />
              <Route path="/best-sellers" element={<BestSellersPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/warranty" element={<WarrantyPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/careers" element={<CareersPage />} />

              {/* Admin Auth */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
              <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
              <Route path="/admin/inventory" element={<AdminLayout><AdminInventoryPage /></AdminLayout>} />
              <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </StoreProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;