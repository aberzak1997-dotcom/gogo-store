import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { StoreProvider } from "./context/StoreContext";
import { AuthProvider } from "./context/AuthContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";

const getPaypalClientId = () =>
  localStorage.getItem("paypal_client_id") ||
  import.meta.env.VITE_PAYPAL_CLIENT_ID ||
  "test";

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
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";
import AdminDiscountsPage from "./pages/admin/AdminDiscountsPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
import AdminReturnsPage from "./pages/admin/AdminReturnsPage";
import AdminMarketingPage from "./pages/admin/AdminMarketingPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminIntegrationsPage from "./pages/admin/AdminIntegrationsPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminShippingPage from "./pages/admin/AdminShippingPage";
import AdminSeoPage from "./pages/admin/AdminSeoPage";
import AdminArticlesPage from "./pages/admin/AdminArticlesPage";
import AdminCJPage from "./pages/admin/AdminCJPage";
import AdminLayout from "./components/admin/AdminLayout";
import BlogPage from "./pages/storefront/BlogPage";
import ArticlePage from "./pages/storefront/ArticlePage";
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/storefront/CookieConsent";
import OrderTrackingPage from "./pages/storefront/OrderTrackingPage";
import AccountLoginPage from "./pages/storefront/AccountLoginPage";
import AccountPage from "./pages/storefront/AccountPage";

const queryClient = new QueryClient();

const App = () => {
  const [paypalClientId, setPaypalClientId] = useState(getPaypalClientId);

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setPaypalClientId(id || import.meta.env.VITE_PAYPAL_CLIENT_ID || "test");
    };
    window.addEventListener("paypal-config-updated", handler);
    return () => window.removeEventListener("paypal-config-updated", handler);
  }, []);

  return (
  <PayPalScriptProvider key={paypalClientId} options={{ clientId: paypalClientId, currency: "USD", intent: "capture" }}>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CustomerAuthProvider>
      <StoreProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CookieConsent />
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
              <Route path="/track-order" element={<OrderTrackingPage />} />
              <Route path="/account/login" element={<AccountLoginPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<ArticlePage />} />

              {/* Admin Auth */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
              <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
              <Route path="/admin/inventory" element={<AdminLayout><AdminInventoryPage /></AdminLayout>} />
              <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
              <Route path="/admin/customers" element={<AdminLayout><AdminCustomersPage /></AdminLayout>} />
              <Route path="/admin/discounts" element={<AdminLayout><AdminDiscountsPage /></AdminLayout>} />
              <Route path="/admin/reviews" element={<AdminLayout><AdminReviewsPage /></AdminLayout>} />
              <Route path="/admin/returns" element={<AdminLayout><AdminReturnsPage /></AdminLayout>} />
              <Route path="/admin/marketing" element={<AdminLayout><AdminMarketingPage /></AdminLayout>} />
              <Route path="/admin/analytics" element={<AdminLayout><AdminAnalyticsPage /></AdminLayout>} />
              <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />
              <Route path="/admin/integrations" element={<AdminLayout><AdminIntegrationsPage /></AdminLayout>} />
              <Route path="/admin/payments" element={<AdminLayout><AdminPaymentsPage /></AdminLayout>} />
              <Route path="/admin/shipping" element={<AdminLayout><AdminShippingPage /></AdminLayout>} />
              <Route path="/admin/seo" element={<AdminLayout><AdminSeoPage /></AdminLayout>} />
              <Route path="/admin/articles" element={<AdminLayout><AdminArticlesPage /></AdminLayout>} />
              <Route path="/admin/cj-dropshipping" element={<AdminLayout><AdminCJPage /></AdminLayout>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </StoreProvider>
      </CustomerAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
  </PayPalScriptProvider>
  );
};

export default App;