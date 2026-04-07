import React from "react";
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

// ✅ normal imports (no lazy)
import Dashboard from "./pages/dashboard";
import BranchesManagement from "pages/branches-management";
import BranchDetails from "pages/branch-details";
import BorrowersManagement from "pages/borrowers-management";
import BorrowerProfile from "pages/borrower-profile";
import LoansManagement from "pages/loans-management";
import LoanDetails from "pages/loan-details";
import StaffManagement from "pages/staff-management";
import StaffProfile from "pages/staff-profile";
import StaffAttendance from "pages/staff-attendance";
import ExpensesPage from "pages/expenses";
import Settings from "pages/settings";
import Reports from "pages/reports";
import PaymentsManagement from "pages/payments-management";
import Login from "pages/login";
import TodaysCollection from "pages/todays-collection/Collections";
import NotFound from "pages/NotFound";
import Unauthorized from "pages/Unauthorized";

const Routes = () => {
  const IndexRedirect = () => {
    const { user, authLoading } = useAuth();

    if (authLoading) {
      return <FullScreenLoader />;
    }

    return <Navigate to={user ? "/dashboard" : "/login"} replace />;
  };

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
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <BranchesManagement />
                </ProtectedRoute>
              }
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
            <Route
              path="/staff-management"
              element={
                <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER"]}>
                  <StaffManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-attendance"
              element={
                <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER"]}>
                  <StaffAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todays-collection"
              element={
                <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER"]}>
                  <TodaysCollection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-profile/:staffId"
              element={
                <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER"]}>
                  <StaffProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER"]}>
                  <ExpensesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments-management"
              element={
                <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER"]}>
                  <PaymentsManagement />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
