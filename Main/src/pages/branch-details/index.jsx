import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BranchHeader from "./components/BranchHeader";
import PerformanceMetrics from "./components/PerformanceMetrics";
import BranchExpenseOverview from "./components/BranchExpenseOverview";
import EditBranchModal from "./components/EditBranchModal";
import DailyCollectionsWeekly from "./components/DailyCollectionWeekly";
import BranchTodayPaymentsTable from "./components/BranchTodayPaymentsTable";
import Icon from "../../components/AppIcon";
import { useParams } from "react-router-dom";
import { useAuth } from "auth/AuthContext";
import { useUIContext } from "context/UIContext";

const BranchDetails = () => {
  const { user } = useAuth();
  const { setSelectedBranch } = useUIContext();
  const { branchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      gender: "female",
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

  const handleEditBranch = () => {
    setIsEditModalOpen((prev) => !prev);
  };

  const handleStatusToggle = () => {
    console.log("Toggle branch status");
  };

  const navigateWithBranchContext = (path) => {
    setSelectedBranch({
      id: Number(branchId),
      branch_name: branchData?.branch_name || branchData?.name || "Branch",
      location: branchData?.location || branchData?.address || "",
    });
    navigate(path);
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
        onEdit={user?.role === "ADMIN" ? handleEditBranch : undefined}
        onStatusToggle={user?.role === "ADMIN" ? handleStatusToggle : undefined}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <button
          type="button"
          onClick={() => navigateWithBranchContext("/borrowers-management")}
          className="rounded-2xl border border-border bg-card px-4 py-4 text-left shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          <p className="text-sm font-semibold text-foreground">Borrowers</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Open the full borrower management page.
          </p>
        </button>
        <button
          type="button"
          onClick={() => navigateWithBranchContext("/staff-management")}
          className="rounded-2xl border border-border bg-card px-4 py-4 text-left shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          <p className="text-sm font-semibold text-foreground">Staff</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage staff, attendance, and salary from the staff workspace.
          </p>
        </button>
        <button
          type="button"
          onClick={() => navigateWithBranchContext("/expenses")}
          className="rounded-2xl border border-border bg-card px-4 py-4 text-left shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          <p className="text-sm font-semibold text-foreground">Expenses</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Go deeper into branch spending and monthly totals.
          </p>
        </button>
      </div>

      <PerformanceMetrics branchId={branchId} metrics={performanceMetrics} />
      <BranchExpenseOverview branchId={branchId} />
      <DailyCollectionsWeekly branchId={branchId} />
      <BranchTodayPaymentsTable />
      <EditBranchModal
        branchId={branchId}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(data) => console.log("Updated branch data:", data)}
        initialData={branchData}
      />
    </div>
  );
};

export default BranchDetails;
