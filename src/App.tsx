import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Layouts
import TenantLayout from "@/components/layout/TenantLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Pages
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

// Tenant Pages
import TenantDashboard from "@/pages/tenant/TenantDashboard";
import PropertyDetails from "@/pages/tenant/PropertyDetails";
import ENachRegistration from "@/pages/tenant/ENachRegistration";
import TenantPayments from "@/pages/tenant/TenantPayments";
import PaymentHistory from "@/pages/tenant/PaymentHistory";
import TenantNotices from "@/pages/tenant/TenantNotices";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import TenantManagement from "@/pages/admin/TenantManagement";
import PropertyMaster from "@/pages/admin/PropertyMaster";
import ContractManagement from "@/pages/admin/ContractManagement";
import BillingDemand from "@/pages/admin/BillingDemand";
import ENachManagement from "@/pages/admin/ENachManagement";
import Reports from "@/pages/admin/Reports";
import AdminNotices from "@/pages/admin/AdminNotices";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRole: 'tenant' | 'admin';
}> = ({ children, allowedRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (userRole !== allowedRole) {
    return <Navigate to={userRole === 'tenant' ? '/tenant/dashboard' : '/admin/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

// App Routes Component
const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();
  
  return (
    <Routes>
      {/* Login Page */}
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? <Navigate to={userRole === 'tenant' ? '/tenant/dashboard' : '/admin/dashboard'} replace />
            : <LoginPage />
        } 
      />

      {/* Tenant Routes */}
      <Route 
        path="/tenant" 
        element={
          <ProtectedRoute allowedRole="tenant">
            <TenantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TenantDashboard />} />
        <Route path="property" element={<PropertyDetails />} />
        <Route path="enach" element={<ENachRegistration />} />
        <Route path="payments" element={<TenantPayments />} />
        <Route path="history" element={<PaymentHistory />} />
        <Route path="notices" element={<TenantNotices />} />
      </Route>

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tenants" element={<TenantManagement />} />
        <Route path="properties" element={<PropertyMaster />} />
        <Route path="contracts" element={<ContractManagement />} />
        <Route path="billing" element={<BillingDemand />} />
        <Route path="enach" element={<ENachManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notices" element={<AdminNotices />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/bmc-rent-lease-collection">
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
