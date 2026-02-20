import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import StaffFilters from "./components/StaffFilters";
import StaffTable from "./components/StaffTable";
import AddStaffModal from "./components/AddStaffModal";
import EditStaffModal from "./components/EditStaffModal";
import Pagination from "./components/Pagination";
import { useGetStaffList } from "hooks/staff.management.page.hooks/useGetStaffList";

const StaffManagement = () => {
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    branch: "all",
    role: "all",
  });

  // 🔹 Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400); // 400ms debounce

    return () => clearTimeout(t);
  }, [filters.search]);

  // Reset to page 1 when filters / sort / pageSize change
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

  // 🔌 Fetch from backend
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

  const totalItems = pagination?.total ?? 0;
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  // Handlers
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleOpenEditModal = (staff) => {
    setSelectedStaff(staff);
    setIsEditStaffModalOpen(true);
  };

  const handleDeleteStaff = (staffId) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      console.log("Delete staff:", staffId);
      // TODO: call delete API, then refetch
    }
  };

  if (isError) {
    return (
      <div className="p-4 text-destructive">
        Failed to load staff: {error?.message}
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Icon name="Users" size={32} className="text-primary" />
            Staff Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your staff members across all branches
          </p>
        </div>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setIsAddStaffModalOpen(true)}
          className="w-full sm:w-auto"
        >
          Add Staff Member
        </Button>
      </div>

      {/* Filters */}
      <StaffFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        totalStaff={totalItems}
        filteredCount={staff.length}
      />

      {/* Table */}
      <StaffTable
        staff={staff}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onSort={handleSort}
        sortConfig={sortConfig}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteStaff}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={totalItems}
      />

      {/* Modals */}
      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onSubmit={() => {
          setIsAddStaffModalOpen(false);
          // TODO: call create API, then refetch
        }}
      />

      <EditStaffModal
        isOpen={isEditStaffModalOpen}
        onClose={() => {
          setIsEditStaffModalOpen(false);
          setSelectedStaff(null);
        }}
        onSubmit={() => {
          setIsEditStaffModalOpen(false);
          setSelectedStaff(null);
          // TODO: call update API, then refetch
        }}
        staffData={selectedStaff}
      />
    </>
  );
};

export default StaffManagement;
