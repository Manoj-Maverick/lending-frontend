import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Dashboard from "./pages/dashboard";
import BranchesManagement from "pages/branches-management";
import BranchDetails from "pages/branch-details";
import AppLayout from "layouts/AppLayout";
import ClientsManagement from "pages/clients-management";
import ClientProfile from "pages/client-profile";
import LoansManagement from "pages/loans-management";
import LoanDetails from "pages/loan-details";
import StaffManagement from "pages/staff-management";
import StaffProfile from "pages/staff-profile";
import Settings from "pages/settings";
import Reports from "pages/reports";
import PaymentsManagement from "pages/payments-management";
import Login from "pages/login";
import ProtectedRoute from "auth/ProtectedRoute";
import TodaysCollection from "pages/todays-collection/TodaysCollection";
import { useAuth } from "auth/AuthContext";
import { Navigate } from "react-router-dom";
const Routes = () => {
  const IndexRedirect = () => {
    const { user } = useAuth();
    return <Navigate to={user ? "/dashboard" : "/login"} replace />;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouterRoutes>
        <Route index element={<IndexRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/branches-management" element={<BranchesManagement />} />
          <Route path="/branch-details/:branchId" element={<BranchDetails />} />
          <Route path="/clients-management" element={<ClientsManagement />} />
          <Route path="/client-profile/:clientId" element={<ClientProfile />} />
          <Route path="/loans-management" element={<LoansManagement />} />
          <Route path="/loan-details/:loanId" element={<LoanDetails />} />
          <Route path="/staff-management" element={<StaffManagement />} />
          <Route path="/todays-collection" element={<TodaysCollection />} />
          <Route path="/staff-profile/:staffId" element={<StaffProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/payments-management" element={<PaymentsManagement />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;
