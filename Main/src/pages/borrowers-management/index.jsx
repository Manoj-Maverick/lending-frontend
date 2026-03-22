import React, { useState } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import BorrowersListPage from "./components/borrowersListPage";
import AddBorrowerModal from "./components/AddBorrowerModal";
import BlocklistModal from "./components/BlocklistModal";
import { useBorrowerStats } from "hooks/borrowers/useBorrowerStats";
import { PageHeaderSkeleton, Skeleton, StatCardSkeleton } from "components/ui/Skeleton";

const BorrowersManagementSkeleton = () => (
  <>
    <PageHeaderSkeleton />
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 md:mb-8 md:gap-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Skeleton className="h-11 w-full rounded-xl lg:col-span-2" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="hidden gap-4 md:flex">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

const BorrowersManagement = () => {
  const [isAddBorrowerModalOpen, setIsAddBorrowerModalOpen] = useState(false);
  const [branch, setBranch] = useState(null);
  const [blocklistModal, setBlocklistModal] = useState({
    isOpen: false,
    borrowerData: null,
    isUnblocking: false,
  });

  // ✅ REAL DATA
  const { data: stats, isLoading, isError } = useBorrowerStats(branch);

  const handleBlocklistConfirm = () => {
    setBlocklistModal({
      isOpen: false,
      borrowerData: null,
      isUnblocking: false,
    });
  };

  if (isLoading) {
    return <BorrowersManagementSkeleton />;
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2 flex items-center gap-3">
            <Icon name="Users" size={32} className="text-primary" />
            Borrowers Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage borrower profiles and loan portfolios
          </p>
        </div>

        <Button
          variant="default"
          size="lg"
          iconName="UserPlus"
          iconPosition="left"
          onClick={() => setIsAddBorrowerModalOpen(true)}
        >
          Add Borrower
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
        {isError ? (
          <div className="col-span-full text-destructive">
            Failed to load stats
          </div>
        ) : (
          <>
            <StatCard
              icon="Users"
              label="Total Borrowers"
              value={stats?.total || 0}
              color="blue"
            />
            <StatCard
              icon="CircleDot"
              label="Active Loans"
              value={stats?.active || 0}
              color="emerald"
            />
            <StatCard
              icon="AlertCircle"
              label="Delayed"
              value={stats?.delayed || 0}
              color="amber"
            />
            <StatCard
              icon="Circle"
              label="No Loan"
              value={stats?.noLoan || 0}
              color="gray"
            />
            <StatCard
              icon="Ban"
              label="Blocked"
              value={stats?.blocked || 0}
              color="red"
            />
          </>
        )}
      </div>

      {/* List */}
      <BorrowersListPage branch={branch} setBranch={setBranch} />

      {/* Add Modal */}
      <AddBorrowerModal
        isOpen={isAddBorrowerModalOpen}
        onClose={() => setIsAddBorrowerModalOpen(false)}
      />

      {/* Blocklist Modal */}
      <BlocklistModal
        isOpen={blocklistModal.isOpen}
        onClose={() =>
          setBlocklistModal({
            isOpen: false,
            borrowerData: null,
            isUnblocking: false,
          })
        }
        onConfirm={handleBlocklistConfirm}
        borrowerData={blocklistModal.borrowerData}
        isUnblocking={blocklistModal.isUnblocking}
      />
    </>
  );
};

/* 🔹 Small reusable component */
const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-500/10 text-blue-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    amber: "bg-amber-500/10 text-amber-600",
    gray: "bg-gray-500/10 text-gray-600",
    red: "bg-red-500/10 text-red-600",
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${colors[color]}`}
        >
          <Icon name={icon} size={20} />
        </div>
      </div>

      <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
        {value}
      </h3>
      <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

export default BorrowersManagement;
