import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BranchHeader from "./components/BranchHeader";
import PerformanceMetrics from "./components/PerformanceMetrics";
import StaffManagement from "./components/StaffManagement";
import RecentTransactions from "./components/RecentTransactions";
import OverdueAccounts from "./components/OverdueAccounts";
import EditBranchModal from "./components/EditBranchModal";
import AddStaffModal from "./components/AddStaffModal";
import DailyCollectionsWeekly from "./components/DailyCollectionWeekly";
import BranchTodayPaymentsTable from "./components/BranchTodayPaymentsTable";
import BranchClients from "./components/BranchCustomerTable";
import Icon from "../../components/AppIcon";
import { useParams } from "react-router-dom";
import { useAuth } from "auth/AuthContext";

const BranchDetails = () => {
  const { user } = useAuth();
  const { branchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  // Get branch data from state or use mock data
  const branchData = location?.state?.branchData || {
    id: "br-001",
    name: "Main Branch",
    code: "MB-001",
    location: "Downtown District, 123 Main Street",
    status: "active",
    manager: {
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@sdfc.com",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_14da91c34-1763294780479.png",
      avatarAlt:
        "Professional headshot of Caucasian woman with shoulder-length brown hair wearing navy blue blazer",
    },
    statistics: {
      totalClients: 245,
      activeLoans: 189,
      totalDisbursed: 2450000,
      outstanding: 1850000,
      collectionRate: 94,
      staffCount: 12,
    },
  };

  const performanceMetrics = {
    totalClients: branchData?.statistics?.totalClients || 342,
    activeLoans: branchData?.statistics?.activeLoans || 187,
    totalDisbursed: branchData?.statistics?.totalDisbursed || 2450000,
    outstandingAmount: branchData?.statistics?.outstanding || 1875000,
    collectionRate: branchData?.statistics?.collectionRate || 94.5,
    overdueAccounts: 12,
  };

  const staffMembers = [
    {
      id: "staff-001",
      name: "Sarah Johnson",
      role: "Branch Manager",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@sdfc.com",
      status: "Active",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_14da91c34-1763294780479.png",
      avatarAlt:
        "Professional headshot of Caucasian woman with shoulder-length brown hair wearing navy blue blazer",
    },
    {
      id: "staff-002",
      name: "Michael Chen",
      role: "Loan Officer",
      phone: "+1 (555) 234-5678",
      email: "michael.chen@sdfc.com",
      status: "Active",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1bb8988be-1763295050652.png",
      avatarAlt:
        "Professional headshot of Asian man with short black hair wearing gray suit and blue tie",
    },
    {
      id: "staff-003",
      name: "Emily Rodriguez",
      role: "Loan Officer",
      phone: "+1 (555) 345-6789",
      email: "emily.rodriguez@sdfc.com",
      status: "Active",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_150bdd3bd-1763295698214.png",
      avatarAlt:
        "Professional headshot of Hispanic woman with long dark hair wearing white blouse and black blazer",
    },
    {
      id: "staff-004",
      name: "David Thompson",
      role: "Collection Agent",
      phone: "+1 (555) 456-7890",
      email: "david.thompson@sdfc.com",
      status: "Active",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1faa738ad-1763294932464.png",
      avatarAlt:
        "Professional headshot of African American man with short hair wearing dark suit and red tie",
    },
    {
      id: "staff-005",
      name: "Jessica Williams",
      role: "Collection Agent",
      phone: "+1 (555) 567-8901",
      email: "jessica.williams@sdfc.com",
      status: "Inactive",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_18d99fd4b-1763300661484.png",
      avatarAlt:
        "Professional headshot of Caucasian woman with blonde hair in bun wearing teal blouse",
    },
  ];

  const recentTransactions = [
    {
      id: "txn-001",
      date: "2026-01-16",
      clientName: "Robert Martinez",
      loanCode: "LN-2024-001",
      type: "Payment",
      amount: 250,
      status: "Completed",
    },
    {
      id: "txn-002",
      date: "2026-01-16",
      clientName: "Lisa Anderson",
      loanCode: "LN-2024-045",
      type: "Payment",
      amount: 180,
      status: "Completed",
    },
    {
      id: "txn-003",
      date: "2026-01-15",
      clientName: "James Wilson",
      loanCode: "LN-2024-089",
      type: "Disbursement",
      amount: 5000,
      status: "Completed",
    },
    {
      id: "txn-004",
      date: "2026-01-15",
      clientName: "Maria Garcia",
      loanCode: "LN-2024-112",
      type: "Payment",
      amount: 320,
      status: "Pending",
    },
    {
      id: "txn-005",
      date: "2026-01-14",
      clientName: "Thomas Brown",
      loanCode: "LN-2024-067",
      type: "Payment",
      amount: 150,
      status: "Failed",
    },
  ];

  const overdueAccounts = [
    {
      id: "overdue-001",
      clientId: "client-001",
      clientName: "Patricia Davis",
      loanCode: "LN-2023-234",
      overdueAmount: 850,
      daysOverdue: 45,
      lastPaymentDate: "2025-12-02",
      phone: "+1 (555) 111-2222",
    },
    {
      id: "overdue-002",
      clientId: "client-002",
      clientName: "Christopher Lee",
      loanCode: "LN-2023-189",
      overdueAmount: 620,
      daysOverdue: 32,
      lastPaymentDate: "2025-12-15",
      phone: "+1 (555) 222-3333",
    },
    {
      id: "overdue-003",
      clientId: "client-003",
      clientName: "Amanda Taylor",
      loanCode: "LN-2024-012",
      overdueAmount: 450,
      daysOverdue: 18,
      lastPaymentDate: "2025-12-29",
      phone: "+1 (555) 333-4444",
    },
  ];

  const handleEditBranch = () => {
    setIsEditModalOpen((prev) => !prev);
  };

  const handleStatusToggle = () => {
    console.log("Toggle branch status");
  };

  const handleAddStaff = () => {
    setIsAddStaffModalOpen((prev) => !prev);
  };

  const handleToggleStaffStatus = (staffId) => {
    console.log("Toggle staff status:", staffId);
  };

  const handleRemoveStaff = (staffId) => {
    console.log("Remove staff member:", staffId);
  };

  const handleViewClient = (clientId) => {
    navigate("/client-profile", { state: { clientId } });
  };

  return (
    <div className="space-y-5 md:space-y-6">
      {user?.role == "ADMIN" ? (
        <div>
          <button
            onClick={() => navigate("/branches-management")}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-sm md:text-base text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors duration-250"
          >
            <Icon name="ArrowLeft" size={20} />
            <span>Back to Branches Management</span>
          </button>
        </div>
      ) : (
        ""
      )}

      <BranchHeader
        branchId={branchId}
        branch={branchData}
        onEdit={handleEditBranch}
        onStatusToggle={handleStatusToggle}
      />
      <PerformanceMetrics branchId={branchId} metrics={performanceMetrics} />
      <DailyCollectionsWeekly branchId={branchId} />
      <BranchTodayPaymentsTable />
      <BranchClients />
      <StaffManagement
        branchId={branchId}
        staff={staffMembers}
        onAddStaff={handleAddStaff}
        onToggleStatus={handleToggleStaffStatus}
        onRemoveStaff={handleRemoveStaff}
      />
      <RecentTransactions transactions={recentTransactions} />
      <OverdueAccounts
        accounts={overdueAccounts}
        onViewClient={handleViewClient}
      />
      <EditBranchModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(data) => console.log("Updated branch data:", data)}
        initialData={branchData}
      />
      <AddStaffModal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onSubmit={(data) => console.log("New staff data:", data)}
      />
    </div>
  );
};

export default BranchDetails;
