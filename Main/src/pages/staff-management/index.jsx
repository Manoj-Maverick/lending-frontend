import React, { useEffect, useState } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import StaffFilters from "./components/StaffFilters";
import StaffTable from "./components/StaffTable";
import AddStaffModal from "./components/AddStaffModal";
import EditStaffModal from "./components/EditStaffModal";
import Pagination from "./components/Pagination";
import PageShell from "components/ui/PageShell";
import AnimatedSection from "components/ui/AnimatedSection";
import {
  useCreateStaff,
  useDeleteStaff,
  useGetStaffList,
  useUpdateStaff,
} from "hooks/staff/useStaffList";
import {
  PageHeaderSkeleton,
  Skeleton,
  TableCardSkeleton,
} from "components/ui/Skeleton";
import { useUIContext } from "context/UIContext";

const StaffManagementSkeleton = () => (
  <PageShell className="pb-4">
    <PageHeaderSkeleton />
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <Skeleton className="mb-3 h-4 w-24 rounded" />
          <Skeleton className="mb-2 h-8 w-20 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      ))}
    </div>
    <div className="mb-6 rounded-2xl border border-border bg-card p-4 md:mb-8 md:p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Skeleton className="h-11 w-full rounded-xl lg:col-span-2" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
    <TableCardSkeleton rows={6} columns={6} />
  </PageShell>
);

const StaffManagement = () => {
  const { showToast } = useUIContext();
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [filters, setFilters] = useState({
    search: "",
    branch: "all",
    role: "all",
  });
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400);

    return () => clearTimeout(t);
  }, [filters.search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    filters.branch,
    filters.role,
    sortConfig.key,
    sortConfig.direction,
    itemsPerPage,
  ]);

  const { data, isLoading, isError, error } = useGetStaffList({
    search: debouncedSearch,
    branch: filters.branch,
    role: filters.role,
    sortKey: sortConfig.key,
    sortDir: sortConfig.direction,
    page: currentPage,
    pageSize: itemsPerPage,
  });

  const staff = data?.data ?? [];
  const pagination = data?.pagination;
  const createStaffMutation = useCreateStaff();
  const updateStaffMutation = useUpdateStaff();
  const deleteStaffMutation = useDeleteStaff();

  const totalItems = pagination?.total ?? 0;
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  const activeCount = staff.filter((member) => member?.status === true).length;
  const inactiveCount = staff.filter((member) => member?.status !== true).length;
  const managerCount = staff.filter(
    (member) => member?.role === "BRANCH_MANAGER",
  ).length;
  const adminCount = staff.filter((member) => member?.role === "ADMIN").length;
  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.branch !== "all" ||
    filters.role !== "all";

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleOpenEditModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsEditStaffModalOpen(true);
  };

  const handleDeleteStaff = async (staffMember) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaffMutation.mutateAsync(staffMember.id);
        showToast?.(
          `${staffMember?.name || "Staff member"} deactivated successfully`,
          "success",
        );
      } catch (mutationError) {
        showToast?.(
          mutationError?.message || "Failed to delete staff member",
          "error",
        );
      }
    }
  };

  if (isError) {
    return (
      <PageShell className="pb-4">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          Failed to load staff: {error?.message}
        </div>
      </PageShell>
    );
  }

  if (isLoading) {
    return <StaffManagementSkeleton />;
  }

  return (
    <PageShell className="pb-4">
      <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Icon name="ShieldCheck" size={14} />
            Team Operations
          </div>
          <h1 className="flex items-center gap-3 text-3xl font-semibold text-foreground md:text-4xl">
            <Icon name="Users" size={32} className="text-primary" />
            Staff Management
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Track branch teams, filter by role, and manage employee access from
            one place.
          </p>
        </div>
        <Button
          variant="default"
          iconName="UserPlus"
          iconPosition="left"
          onClick={() => setIsAddStaffModalOpen(true)}
          className="w-full sm:w-auto"
        >
          Add Staff Member
        </Button>
      </div>

      <AnimatedSection
        className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        delay={80}
      >
        {[
          {
            label: "Visible Staff",
            value: staff.length,
            hint: hasActiveFilters ? `Filtered from ${totalItems}` : "Current page results",
            icon: "Users",
            tone: "bg-primary/10 text-primary",
          },
          {
            label: "Active Members",
            value: activeCount,
            hint: "Currently enabled accounts",
            icon: "UserCheck",
            tone: "bg-emerald-500/10 text-emerald-600",
          },
          {
            label: "Branch Managers",
            value: managerCount,
            hint: `${adminCount} admins in this view`,
            icon: "BriefcaseBusiness",
            tone: "bg-violet-500/10 text-violet-600",
          },
          {
            label: "Inactive Members",
            value: inactiveCount,
            hint: "Needs review or reactivation",
            icon: "UserX",
            tone: "bg-amber-500/10 text-amber-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.tone}`}
              >
                <Icon name={item.icon} size={20} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{item.hint}</p>
          </div>
        ))}
      </AnimatedSection>

      <AnimatedSection delay={120}>
        <StaffFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          totalStaff={totalItems}
          filteredCount={staff.length}
        />
      </AnimatedSection>

      <AnimatedSection delay={160}>
        <StaffTable
          staff={staff}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onSort={handleSort}
          sortConfig={sortConfig}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteStaff}
        />
      </AnimatedSection>

      <AnimatedSection delay={220}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={totalItems}
        />
      </AnimatedSection>

      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        isSubmitting={createStaffMutation.isPending}
        onSubmit={async (payload) => {
          try {
            await createStaffMutation.mutateAsync(payload);
            setIsAddStaffModalOpen(false);
            showToast?.("Staff member created successfully", "success");
          } catch (mutationError) {
            showToast?.(
              mutationError?.message || "Failed to create staff member",
              "error",
            );
          }
        }}
      />

      <EditStaffModal
        isOpen={isEditStaffModalOpen}
        onClose={() => {
          setIsEditStaffModalOpen(false);
          setSelectedStaff(null);
        }}
        isSubmitting={updateStaffMutation.isPending}
        onSubmit={async (payload) => {
          try {
            await updateStaffMutation.mutateAsync(payload);
            setIsEditStaffModalOpen(false);
            setSelectedStaff(null);
            showToast?.("Staff member updated successfully", "success");
          } catch (mutationError) {
            showToast?.(
              mutationError?.message || "Failed to update staff member",
              "error",
            );
          }
        }}
        staffData={selectedStaff}
      />
    </PageShell>
  );
};

export default StaffManagement;
