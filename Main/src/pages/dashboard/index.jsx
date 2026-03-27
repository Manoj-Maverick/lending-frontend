import React from "react";
import Icon from "../../components/AppIcon";
import StatCard from "./components/StatCard";
import DailyCollectionTable from "./components/DailyCollectionTable";
import TodayPaymentsTable from "./components/TodayPaymentsTable";
import LoanStatusChart from "./components/LoanStatusChart";
import MonthlyCollectionChart from "./components/MonthlyCollectionChart";
import BranchComparisonChart from "./components/BranchComparisonChart";
import NoBranchAssigned from "components/NoBranchAssigned";
import { useDashboardSummary } from "hooks/dashboard/useDashboardSummary";
import { useUIContext } from "context/UIContext";
import { useAuth } from "auth/AuthContext";
import PageShell from "components/ui/PageShell";
import AnimatedSection from "components/ui/AnimatedSection";
import {
  ChartCardSkeleton,
  PageHeaderSkeleton,
  StatCardSkeleton,
  TableCardSkeleton,
} from "components/ui/Skeleton";

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
    return (
      <PageShell className="pb-2 md:pb-4">
        <PageHeaderSkeleton showAction={false} />
        <div className="mb-6 mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:mb-8 lg:grid-cols-3 lg:gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
        <div className="mb-6 grid grid-cols-1 gap-4 md:gap-5 lg:mb-8 lg:grid-cols-2 lg:gap-6">
          <TableCardSkeleton rows={7} columns={5} showAvatar={false} />
          <TableCardSkeleton rows={5} columns={6} showHeaderAction />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-4 md:gap-5 lg:mb-8 lg:grid-cols-2 lg:gap-6">
          <ChartCardSkeleton />
          <ChartCardSkeleton />
        </div>
        <ChartCardSkeleton />
      </PageShell>
    );
  }

  if (isError) {
    return <p className="p-6">{error.message}</p>;
  }

  return (
    <PageShell className="pb-2 md:pb-4">
      <h1 className="mb-2 flex items-center gap-2.5 text-2xl font-semibold text-foreground md:text-3xl lg:text-4xl">
        <Icon name="LayoutDashboard" size={30} className="text-primary" />
        {user?.role === "ADMIN"
          ? "Admin Dashboard Overview"
          : user?.role === "STAFF"
            ? "Staff Workspace"
            : "Branch Overview"}
      </h1>
      <p className="text-sm text-muted-foreground md:text-base">
        {user?.role === "STAFF"
          ? "Focus on customers, branch work, and loan requests that need approval."
          : "Welcome back! Here&apos;s what&apos;s happening with your lending operations today."}
      </p>

      <div className="motion-stagger mb-6 mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:mb-8 lg:grid-cols-3 lg:gap-5">
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
          title="Total Borrowers"
          value={data?.data.total_clients}
          icon="Users"
          color="green"
          navigateTo="/borrowers-management"
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
          value={`\u20B9${Math.floor(Number(data?.data.today_due)).toLocaleString("en-IN")} / \u20B9${Math.floor(Number(data?.data.today_collected)).toLocaleString("en-IN")}`}
          icon="Calendar"
          color="blue"
        />

        <StatCard
          title="Weekly Collection"
          value={`\u20B9${Math.floor(Number(data?.data.weekly_collection)).toLocaleString("en-IN")}`}
          icon="BarChart3"
          color="purple"
        />
        <StatCard
          title={"Monthly Collection"}
          value={`\u20B9${Math.floor(Number(data?.data.weekly_collection * 4)).toLocaleString("en-IN")}`}
          icon="BarChart"
          color="blue"
        />
      </div>

      <AnimatedSection
        className="mb-6 grid grid-cols-1 gap-4 md:gap-5 lg:mb-8 lg:grid-cols-2 lg:gap-6"
        delay={120}
      >
        <DailyCollectionTable />
        <TodayPaymentsTable />
      </AnimatedSection>

      <AnimatedSection
        className="mb-6 grid grid-cols-1 gap-4 md:gap-5 lg:mb-8 lg:grid-cols-2 lg:gap-6"
        delay={180}
      >
        <LoanStatusChart />
        <MonthlyCollectionChart />
      </AnimatedSection>

      {user?.role !== "STAFF" && (
        <AnimatedSection className="mb-6 md:mb-8" delay={220}>
          <BranchComparisonChart />
        </AnimatedSection>
      )}
    </PageShell>
  );
};

export default Dashboard;
