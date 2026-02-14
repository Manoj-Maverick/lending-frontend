import React, { use } from "react";
import Icon from "../../components/AppIcon";
import StatCard from "./components/StatCard";
import DailyCollectionTable from "./components/DailyCollectionTable";
import TodayPaymentsTable from "./components/TodayPaymentsTable";
import LoanStatusChart from "./components/LoanStatusChart";
import MonthlyCollectionChart from "./components/MonthlyCollectionChart";
import BranchComparisonChart from "./components/BranchComparisonChart";
import NoBranchAssigned from "components/NoBranchAssigned";
import { useDashboardSummary } from "hooks/useDashboardSummary";
import { useUIContext } from "context/UIContext";
import { useAuth } from "auth/AuthContext";

const Dashboard = () => {
  const { selectedBranch } = useUIContext();
  const { user } = useAuth();

  let branchId = null;
  if (user?.role !== "ADMIN") {
    branchId = user?.branchId;
  } else if (selectedBranch?.id && selectedBranch.id !== "all") {
    branchId = selectedBranch.id;
  }

  if (user?.role !== "ADMIN" && branchId == null) {
    return <NoBranchAssigned />;
  }

  const { data, isLoading, isFetching, isError, error } =
    useDashboardSummary(branchId);
  if (isLoading || !data) {
    return <p className="p-6">Loading dashboard…</p>;
  }
  if (isError) {
    return <p className="p-6">{error.message}</p>;
  }

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2 flex items-center gap-3">
          <Icon name="LayoutDashboard" size={32} className="text-primary" />
          {user?.role === "ADMIN"
            ? "Admin Dashboard Overview"
            : "Branch Overview"}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Welcome back! Here's what's happening with your lending operations
          today.
        </p>
      </div>
      {/* {isFetching && (
            <p className="text-sm text-muted-foreground mb-2">Updating…</p>
          )} */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-6 md:mb-8">
        {selectedBranch?.id === "all" && user?.role === "ADMIN" && (
          <StatCard
            title="Total Branches"
            value={data["total_branches"]}
            icon="Building2"
            color="blue"
            navigateTo="/branches-management"
          />
        )}

        <StatCard
          title="Total Clients"
          value={data["total_clients"]}
          icon="Users"
          color="green"
          navigateTo="/clients-management"
        />

        <StatCard
          title="Active Loans"
          value={data["active_loans"]}
          icon="Wallet"
          color="blue"
        />

        <StatCard
          title="Outstanding Amount"
          value={`₹${data["outstanding_amount"]}`}
          icon="TrendingUp"
          color="orange"
        />

        <StatCard
          title="Today Due vs Collected"
          value={`₹${data["today_collected"]} / ₹${data["today_due"]}`}
          icon="Calendar"
          color="blue"
        />

        <StatCard
          title="Weekly Collection"
          value={`₹${data["weekly_collection"]}`}
          subtitle="This week total"
          icon="BarChart3"
          color="purple"
        />
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-6 md:mb-8">
            {statisticsData?.map((stat, index) => (
              <StatCard key={index} title={stat.title} value={stat.value} subtitle={stat.subtitle} icon={stat.icon} color={stat.color} trend={stat.trend} trendValue={stat.trendValue} navigateTo={stat.navigateTo} />
            ))}

 
          </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-6 md:mb-8">
        <DailyCollectionTable />
        <TodayPaymentsTable />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-6 md:mb-8">
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
