import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import BranchCard from "./components/BranchCard";
import AddBranchModal from "./components/AddBranchModal";
import FilterControls from "./components/FilterControls";
import EmptyState from "./components/EmptyState";

import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { useBranchesList } from "hooks/branches/useBranchesList";
import {
  PageHeaderSkeleton,
  Skeleton,
} from "components/ui/Skeleton";
import { useAuth } from "auth/AuthContext";

const BranchesManagementSkeleton = () => (
  <>
    <PageHeaderSkeleton />
    <div className="mb-6 rounded-xl border border-border bg-card p-4 md:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Skeleton className="h-11 w-full rounded-xl md:col-span-2" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  </>
);

const BranchesManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user?.role === "BRANCH_MANAGER" && user?.branchId) {
    return <Navigate to={`/branch-details/${user.branchId}`} replace />;
  }

  // UI state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sortBy: "name-asc",
  });

  const limit = 12;

  // 🔁 Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400); // wait 400ms after typing stops

    return () => clearTimeout(handler);
  }, [filters.search]);

  // 🔵 React Query (SERVER STATE)
  const { data, isLoading, isFetching } = useBranchesList({
    page,
    limit,
    search: debouncedSearch,
    status: filters.status,
    sortBy: filters.sortBy,
  });

  const branches = data?.data || [];
  const pagination = data?.pagination;

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // reset pagination on filter change
  };

  const handleBranchClick = (branch) => {
    navigate(`/branch-details/${branch.id}`);
  };

  const handleAddBranch = (formData) => {
    console.log("New branch data:", formData);
    // later: POST + invalidate query
  };

  const hasActiveFilters = filters.search || filters.status !== "all";

  if (isLoading) {
    return <BranchesManagementSkeleton />;
  }

  return (
    <>
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2 flex items-center gap-3">
            <Icon name="Building2" size={32} className="text-primary" />
            Branches Management
          </h1>

          <p className="text-sm md:text-base text-muted-foreground">
            Manage and monitor all branch locations
          </p>

          {isFetching && (
            <p className="text-xs text-muted-foreground mt-1">Updating…</p>
          )}
        </div>

        {user?.role === "ADMIN" && (
          <Button
            variant="default"
            onClick={() => setIsAddModalOpen(true)}
            iconName="Plus"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Add Branch
          </Button>
        )}
      </div>

      {/* FILTERS */}
      <FilterControls filters={filters} onFilterChange={handleFilterChange} />

      {/* CONTENT */}
      {branches.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {branches.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                onClick={handleBranchClick}
              />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {pagination?.page} of {pagination?.totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page === pagination?.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <EmptyState
          onAddBranch={() => setIsAddModalOpen(true)}
          hasFilters={hasActiveFilters}
        />
      )}

      {/* ADD BRANCH MODAL */}
      {user?.role === "ADMIN" && (
        <AddBranchModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddBranch}
        />
      )}
    </>
  );
};

export default BranchesManagement;
