import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../dashboard/components/StatCard";
import LoansTable from "./components/LoansTable";
import LoanFilters from "./components/LoanFilters";
import CreateLoanModal from "./components/CreateLoanModal";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import Select from "components/ui/Select";
import { useLoans, useLoanStats } from "hooks/loans/useLoans";
import { useUIContext } from "context/UIContext";
import { useAuth } from "auth/AuthContext";
import { useReviewLoanRequest } from "hooks/loans/useLoanApprovals";
import {
  PageHeaderSkeleton,
  Skeleton,
  StatCardSkeleton,
  TableCardSkeleton,
} from "components/ui/Skeleton";

const LoansManagementSkeleton = () => (
  <div className="mx-auto space-y-6">
    <PageHeaderSkeleton />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
    <div className="rounded-lg border border-border bg-card p-4 md:p-6">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
      <TableCardSkeleton
        rows={6}
        columns={6}
        className="border-0 shadow-none"
      />
    </div>
  </div>
);

const LoansManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCreateLoanOpen, setIsCreateLoanOpen] = useState(false);
  const { branches, showToast } = useUIContext();
  const isLoanRequester = user?.role === "STAFF";
  const canReviewLoans =
    user?.role === "ADMIN" || user?.role === "BRANCH_MANAGER";
  const reviewLoanMutation = useReviewLoanRequest();

  const [filters, setFilters] = useState({
    status: "all",
    branch: user?.role === "ADMIN" ? "all" : String(user?.branchId || "all"),
    loanType: "all",
    searchQuery: "",
    collectionDay: "all",
    repaymentType: "all",
  });

  // 🧭 Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // ✅ now selectable

  // 🔹 Debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState(filters.searchQuery);

  // ⏳ Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  // 🔄 Reset page when filters or pageSize change
  useEffect(() => {
    setPage(1);
  }, [
    filters.status,
    filters.branch,
    filters.loanType,
    filters.collectionDay,
    filters.repaymentType, // ✅ ADD THIS
    debouncedSearch,
    pageSize,
  ]);

  // 🔹 Build debounced filters for LIST only
  const debouncedFilters = {
    ...filters,
    searchQuery: debouncedSearch,
    page,
    pageSize,
  };

  // 🔌 Fetch loans list
  const {
    data: listResponse,
    isLoading: isLoansLoading,
    isError: isLoansError,
    error: loansError,
  } = useLoans(debouncedFilters);
  const rawLoans = listResponse?.data ?? [];
  const pagination = listResponse?.pagination;

  // 🔌 Fetch stats
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
  } = useLoanStats(filters.branch);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewLoan = (loan) => {
    navigate(`/loan-details/${loan.loanId}`);
  };

  if (isLoansError) {
    return (
      <div className="p-6 text-destructive">
        Failed to load loans: {loansError.message}
      </div>
    );
  }

  if (isStatsError) {
    return (
      <div className="p-6 text-destructive">
        Failed to load stats: {statsError.message}
      </div>
    );
  }

  if (isLoansLoading && isStatsLoading) {
    return <LoansManagementSkeleton />;
  }

  // 🧱 Map backend → UI shape
  const loans = rawLoans.map((l) => ({
    id: l.loan_code,
    loanId: l.id,
    branch: l.branch,
    clientName: l.client_name,
    clientCode: l.client_code,
    loanAmount: Number(l.loan_amount),
    outstanding: Number(l.outstanding),
    emiAmount: Number(l.emi_amount),
    nextEmiDate: l?.next_emi_date?.split("T")[0] || null,
    interestRate: Number(l.interest_rate),
    tenure: Number(l.tenure_value),
    tenureUnit: l.tenure_unit,
    status: l.status,
    repaymentType: l.repayment_type,
    requestedByName: l.requested_by_name,
    approvedByName: l.approved_by_name,
    rejectionReason: l.rejection_reason,
    requestedAt: l.requested_at,
  }));
  // 📊 Stats cards
  const loanStats = [
    {
      title: "Active Loans",
      value: stats?.active_loans ?? 0,
      subtitle: "Currently running",
      icon: "Wallet",
      color: "blue",
    },
    {
      title: "Closed Loans",
      value: stats?.closed_loans ?? 0,
      subtitle: "Completed",
      icon: "CheckCircle",
      color: "green",
    },
    {
      title: "Foreclosed Loans",
      value: stats?.foreclosed_loans ?? 0,
      subtitle: "Foreclosed cases",
      icon: "XCircle",
      color: "red",
    },
    {
      title: "Outstanding",
      value: `₹${Number(stats?.total_outstanding ?? 0).toLocaleString()}`,
      subtitle: "Yet to be collected",
      icon: "TrendingUp",
      color: "orange",
    },
  ];

  const total = pagination?.total ?? 0;
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  const startRow = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, total);

  return (
    <>
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Icon name="Wallet" size={32} className="text-primary" />
              {isLoanRequester ? "Loan Requests" : "Loans Management"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {isLoanRequester
                ? "Prepare and submit branch loan requests for approval"
                : "Manage loan applications, disbursements, and payment schedules"}
            </p>
          </div>

          <Button
            onClick={() => setIsCreateLoanOpen(true)}
            className="w-full sm:w-auto"
          >
            <Icon name="Plus" size={16} />
            {isLoanRequester ? "Create Loan Request" : "Create New Loan"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {isStatsLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <StatCardSkeleton key={index} />
              ))
            : loanStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
        </div>

        {/* Filters + Table */}
        <div className="bg-card rounded-lg border border-border p-4 md:p-6">
          <LoanFilters
            filters={filters}
            branches={branches}
            onFilterChange={handleFilterChange}
            showBranchFilter={user?.role === "ADMIN"}
          />

          {isLoansLoading ? (
            <TableCardSkeleton
              rows={6}
              columns={6}
              className="border-0 shadow-none"
            />
          ) : (
            <>
              <LoansTable
                loans={loans}
                onViewLoan={handleViewLoan}
                canReview={canReviewLoans}
                isReviewing={reviewLoanMutation.isPending}
                onApprove={async (loan) => {
                  try {
                    await reviewLoanMutation.mutateAsync({
                      loanId: loan.loanId,
                      action: "APPROVE",
                    });
                    showToast?.("Loan request approved", "success");
                  } catch (error) {
                    showToast?.(
                      error?.message || "Failed to approve request",
                      "error",
                    );
                  }
                }}
                onReject={async (loan) => {
                  const rejectionReason =
                    window.prompt(
                      `Why are you rejecting ${loan.id}?`,
                      "Insufficient review details",
                    ) || "";

                  try {
                    await reviewLoanMutation.mutateAsync({
                      loanId: loan.loanId,
                      action: "REJECT",
                      rejectionReason,
                    });
                    showToast?.("Loan request rejected", "success");
                  } catch (error) {
                    showToast?.(
                      error?.message || "Failed to reject request",
                      "error",
                    );
                  }
                }}
              />

              {/* 🧭 Pagination Footer */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Showing X-Y of Z */}
                <div className="text-sm text-muted-foreground">
                  Showing {startRow}–{endRow} of {total}
                </div>

                {/* Right: Controls */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  {/* Rows per page */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      Rows:
                    </span>

                    <div className="w-24">
                      <Select
                        dropdownPlacement="top"
                        value={String(pageSize)}
                        onChange={(value) => setPageSize(Number(value))}
                        options={[
                          { value: "10", label: "10" },
                          { value: "20", label: "20" },
                          { value: "50", label: "50" },
                          { value: "100", label: "100" },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Page + Buttons */}
                  <div className="flex items-center justify-between gap-3 sm:justify-start">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Prev
                    </Button>

                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      Page {page} of {totalPages}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isCreateLoanOpen && (
        <CreateLoanModal
          isOpen={isCreateLoanOpen}
          onClose={() => setIsCreateLoanOpen(false)}
          onSubmit={() => {
            setIsCreateLoanOpen(false);
          }}
        />
      )}
    </>
  );
};

export default LoansManagement;
