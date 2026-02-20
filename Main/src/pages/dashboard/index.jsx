import React from "react";
import Icon from "../../components/AppIcon";
import StatCard from "./components/StatCard";
import DailyCollectionTable from "./components/DailyCollectionTable";
import TodayPaymentsTable from "./components/TodayPaymentsTable";
import LoanStatusChart from "./components/LoanStatusChart";
import MonthlyCollectionChart from "./components/MonthlyCollectionChart";
import BranchComparisonChart from "./components/BranchComparisonChart";
import NoBranchAssigned from "components/NoBranchAssigned";
import { useDashboardSummary } from "hooks/dashboard.page.hooks/useDashboardSummary";
import { useUIContext } from "context/UIContext";
import { useAuth } from "auth/AuthContext";

const Dashboard = () => {
  const { selectedBranch } = useUIContext();
  const { user } = useAuth();

  let branchId = "all";
  if (user?.role !== "ADMIN") {
    branchId = user?.branchId;
  } else if (selectedBranch?.id && selectedBranch.id !== "all") {
    branchId = selectedBranch.id;
  }

  if (user?.role !== "ADMIN" && branchId == null) {
    return <NoBranchAssigned />;
  }

  const { data, isLoading, isError, error } = useDashboardSummary(branchId);

  if (isLoading || !data) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  if (isError) {
    return <p className="p-6">{error.message}</p>;
  }

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="mb-2 flex items-center gap-2.5 text-2xl font-semibold text-foreground md:text-3xl lg:text-4xl">
          <Icon name="LayoutDashboard" size={30} className="text-primary" />
          {user?.role === "ADMIN"
            ? "Admin Dashboard Overview"
            : "Branch Overview"}
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Welcome back! Here&apos;s what&apos;s happening with your lending
          operations today.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:mb-8 lg:grid-cols-3 lg:gap-5">
        {selectedBranch?.id === "all" && user?.role === "ADMIN" && (
          <StatCard
            title="Total Branches"
            value={data?.data.total_branches}
            icon="Building2"
            color="blue"
            navigateTo="/branches-management"
          />
        )}

        <StatCard
          title="Total Clients"
          value={data?.data.total_clients}
          icon="Users"
          color="green"
          navigateTo="/clients-management"
        />

        <StatCard
          title="Active Loans"
          value={data?.data.active_loans}
          icon="Wallet"
          color="blue"
        />

        <StatCard
          title="Outstanding Amount"
          value={`\u20B9${Math.floor(Number(data?.data.outstanding_amount)).toLocaleString("en-IN")}`}
          icon="TrendingUp"
          color="orange"
        />

        <StatCard
          title="Today Due vs Collected"
          value={`\u20B9${Math.floor(Number(data?.data.today_collected)).toLocaleString("en-IN")} / \u20B9${Math.floor(Number(data?.data.today_due)).toLocaleString("en-IN")}`}
          icon="Calendar"
          color="blue"
        />

        <StatCard
          title="Weekly Collection"
          value={`\u20B9${Math.floor(Number(data?.data.weekly_collection)).toLocaleString("en-IN")}`}
          icon="BarChart3"
          color="purple"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:gap-5 lg:mb-8 lg:grid-cols-2 lg:gap-6">
        <DailyCollectionTable />
        <TodayPaymentsTable />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:gap-5 lg:mb-8 lg:grid-cols-2 lg:gap-6">
        <LoanStatusChart />
        <MonthlyCollectionChart />
      </div>

      <div className="mb-6 md:mb-8">
        <BranchComparisonChart />
      </div>
    </>
  );
};

export default Dashboard;
