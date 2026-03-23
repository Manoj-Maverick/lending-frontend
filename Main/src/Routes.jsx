import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as RouterRoutes,
} from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import AppLayout from "layouts/AppLayout";
import ProtectedRoute from "auth/ProtectedRoute";
import { useAuth } from "auth/AuthContext";
import FullScreenLoader from "components/ui/FullScreenLoader";
import PageLoader from "components/ui/PageLoader";

const Dashboard = lazy(() => import("./pages/dashboard"));
const BranchesManagement = lazy(() => import("pages/branches-management"));
const BranchDetails = lazy(() => import("pages/branch-details"));
const BorrowersManagement = lazy(() => import("pages/borrowers-management"));
const BorrowerProfile = lazy(() => import("pages/borrower-profile"));
const LoansManagement = lazy(() => import("pages/loans-management"));
const LoanDetails = lazy(() => import("pages/loan-details"));
const StaffManagement = lazy(() => import("pages/staff-management"));
const StaffProfile = lazy(() => import("pages/staff-profile"));
const Settings = lazy(() => import("pages/settings"));
const Reports = lazy(() => import("pages/reports"));
const PaymentsManagement = lazy(() => import("pages/payments-management"));
const Login = lazy(() => import("pages/login"));
const TodaysCollection = lazy(
  () => import("pages/todays-collection/Collections"),
);
const NotFound = lazy(() => import("pages/NotFound"));
const Unauthorized = lazy(() => import("pages/Unauthorized"));

const preloadDashboard = () => import("./pages/dashboard");

const Routes = () => {
  const IndexRedirect = () => {
    const { user, authLoading } = useAuth();

    if (authLoading && !user) {
      return <FullScreenLoader />;
    }

    return <Navigate to={user ? "/dashboard" : "/login"} replace />;
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      preloadDashboard();
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <RouterRoutes>
          <Route path="/" element={<IndexRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/branches-management"
              element={<BranchesManagement />}
            />
            <Route
              path="/branch-details/:branchId"
              element={<BranchDetails />}
            />
            <Route
              path="/borrowers-management"
              element={<BorrowersManagement />}
            />
            <Route
              path="/borrower-profile/:borrowerId"
              element={<BorrowerProfile />}
            />
            <Route path="/loans-management" element={<LoansManagement />} />
            <Route path="/loan-details/:loanId" element={<LoanDetails />} />
            <Route path="/staff-management" element={<StaffManagement />} />
            <Route path="/todays-collection" element={<TodaysCollection />} />
            <Route path="/staff-profile/:staffId" element={<StaffProfile />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/reports" element={<Reports />} />
            <Route
              path="/payments-management"
              element={<PaymentsManagement />}
            />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/loader" element={<FullScreenLoader />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
