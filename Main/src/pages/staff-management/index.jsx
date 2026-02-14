import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import StaffFilters from "./components/StaffFilters";
import StaffTable from "./components/StaffTable";
import AddStaffModal from "./components/AddStaffModal";
import EditStaffModal from "./components/EditStaffModal";
import Pagination from "./components/Pagination";

const StaffManagement = () => {
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffData, setStaffData] = useState([]);
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

  const mockStaff = [
    {
      id: "ST-001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@lendweb.com",
      phone: "+91 98765 43210",
      code: "ST-001",
      branch: "Main Branch",
      role: "Branch Manager",
      department: "Management",
      status: "Active",
      joinDate: "2023-01-15",
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1b09cae8d-1763295945796.png",
      photoAlt: "Professional headshot of Indian man with short black hair",
    },
    {
      id: "ST-002",
      name: "Priya Sharma",
      email: "priya.sharma@lendweb.com",
      phone: "+91 98765 43211",
      code: "ST-002",
      branch: "North Branch",
      role: "Loan Officer",
      department: "Operations",
      status: "Active",
      joinDate: "2023-03-20",
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_111e29bbe-1763294966477.png",
      photoAlt: "Professional headshot of Indian woman with long black hair",
    },
    {
      id: "ST-003",
      name: "Amit Patel",
      email: "amit.patel@lendweb.com",
      phone: "+91 98765 43212",
      code: "ST-003",
      branch: "South Branch",
      role: "Finance Manager",
      department: "Finance",
      status: "Active",
      joinDate: "2023-05-10",
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_17c3cbb98-1763291944258.png",
      photoAlt: "Professional headshot of Indian man with glasses",
    },
    {
      id: "ST-004",
      name: "Sneha Reddy",
      email: "sneha.reddy@lendweb.com",
      phone: "+91 98765 43213",
      code: "ST-004",
      branch: "East Branch",
      role: "Customer Service Executive",
      department: "Customer Service",
      status: "Active",
      joinDate: "2023-07-05",
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_131bae20c-1763295387671.png",
      photoAlt: "Professional headshot of Indian woman with short hair",
    },
    {
      id: "ST-005",
      name: "Vikram Singh",
      email: "vikram.singh@lendweb.com",
      phone: "+91 98765 43214",
      code: "ST-005",
      branch: "West Branch",
      role: "Loan Officer",
      department: "Operations",
      status: "On Leave",
      joinDate: "2023-09-12",
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_13bcb65fb-1763295902656.png",
      photoAlt: "Professional headshot of Indian man with beard",
    },
    {
      id: "ST-006",
      name: "Anita Desai",
      email: "anita.desai@lendweb.com",
      phone: "+91 98765 43215",
      code: "ST-006",
      branch: "Main Branch",
      role: "HR Executive",
      department: "Human Resources",
      status: "Active",
      joinDate: "2022-11-08",
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_19d9d7cd2-1763293467118.png",
      photoAlt: "Professional headshot of Indian woman",
    },
    {
      id: "ST-007",
      name: "Rohan Gupta",
      email: "rohan.gupta@lendweb.com",
      phone: "+91 98765 43216",
      code: "ST-007",
      branch: "North Branch",
      role: "IT Manager",
      department: "Information Technology",
      status: "Active",
      joinDate: "2023-02-14",
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_14dcb65fb-1763295902656.png",
      photoAlt: "Professional headshot of Indian man",
    },
    {
      id: "ST-008",
      name: "Divya Nair",
      email: "divya.nair@lendweb.com",
      phone: "+91 98765 43217",
      code: "ST-008",
      branch: "South Branch",
      role: "Audit Officer",
      department: "Audit",
      status: "Inactive",
      joinDate: "2022-06-20",
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_15ecb65fb-1763295902656.png",
      photoAlt: "Professional headshot of Indian woman",
    },
  ];

  const [filteredStaff, setFilteredStaff] = useState(mockStaff);

  useEffect(() => {
    setStaffData(mockStaff);
  }, []);

  useEffect(() => {
    let result = staffData.length > 0 ? staffData : mockStaff;

    // Apply search filter
    if (filters.search) {
      result = result.filter(
        (staff) =>
          staff.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          staff.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          staff.phone.includes(filters.search) ||
          staff.code.includes(filters.search),
      );
    }

    // Apply branch filter
    if (filters.branch !== "all") {
      result = result.filter((staff) => staff.branch === filters.branch);
    }

    // Apply role filter
    if (filters.role !== "all") {
      result = result.filter((staff) => staff.role === filters.role);
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredStaff(result);
    setCurrentPage(1);
  }, [filters, sortConfig]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleAddStaff = (staffData) => {
    console.log("New staff:", staffData);
    const newStaff = {
      id: `ST-${String(staffData.length + 1).padStart(3, "0")}`,
      code: `ST-${String(staffData.length + 1).padStart(3, "0")}`,
      ...staffData,
      status: "Active",
    };
    setStaffData((prev) => [...prev, newStaff]);
    setIsAddStaffModalOpen(false);
    // Add API call here to save staff data
  };

  const handleEditStaff = (updatedStaffData) => {
    console.log("Updated staff:", updatedStaffData);
    setStaffData((prev) =>
      prev.map((staff) =>
        staff.id === selectedStaff.id
          ? { ...staff, ...updatedStaffData }
          : staff,
      ),
    );
    setIsEditStaffModalOpen(false);
    setSelectedStaff(null);
    // Add API call here to update staff data
  };

  const handleDeleteStaff = (staffId) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      console.log("Deleting staff:", staffId);
      setStaffData((prev) => prev.filter((staff) => staff.id !== staffId));
      // Add API call here to delete staff data
    }
  };

  const handleOpenEditModal = (staff) => {
    setSelectedStaff(staff);
    setIsEditStaffModalOpen(true);
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Staff Management", path: "/staff-management" },
  ];

  return (
    <>
      {/* Page Header */}
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
        totalStaff={mockStaff.length}
        filteredCount={filteredStaff.length}
      />

      {/* Table */}
      <StaffTable
        staff={filteredStaff}
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
        totalPages={Math.ceil(filteredStaff.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={filteredStaff.length}
      />

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onSubmit={handleAddStaff}
      />

      {/* Edit Staff Modal */}
      <EditStaffModal
        isOpen={isEditStaffModalOpen}
        onClose={() => {
          setIsEditStaffModalOpen(false);
          setSelectedStaff(null);
        }}
        onSubmit={handleEditStaff}
        staffData={selectedStaff}
      />
    </>
  );
};

export default StaffManagement;
