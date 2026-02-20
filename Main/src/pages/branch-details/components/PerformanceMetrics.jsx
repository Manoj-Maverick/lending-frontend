import React from "react";
import Icon from "../../../components/AppIcon";
import { useFetchBranchPerformanceMetricsByID } from "hooks/branch.details.page.hooks/useGetSpecificBranchPerformanceMetrics";

const PerformanceMetrics = ({ branchId }) => {
  const { data, isLoading } = useFetchBranchPerformanceMetricsByID(branchId);

  if (isLoading) {
    return <div className="p-6 bg-card rounded-xl border border-border">Loading branch data...</div>;
  }

  const totalClients = Number(data?.total_clients || 0);
  const activeLoans = Number(data?.active_loans || 0);
  const totalDisbursed = Math.floor(Number(data?.total_disbursed || 0));
  const outstanding = Math.floor(Number(data?.outstanding || 0));
  const totalCollected = Math.floor(Number(data?.total_collected || 0));
  const overdueAccounts = Number(data?.overdue_accounts || 3);
  const collectionRate = totalDisbursed > 0 ? (totalCollected / totalDisbursed) * 100 : 0;

  const metricCards = [
    {
      label: "Total Clients",
      value: totalClients.toLocaleString("en-IN"),
      icon: "Users",
      bgColor: "bg-primary/10",
      iconColor: "var(--color-primary)",
    },
    {
      label: "Active Loans",
      value: activeLoans.toLocaleString("en-IN"),
      icon: "Wallet",
      bgColor: "bg-accent/10",
      iconColor: "var(--color-accent)",
    },
    {
      label: "Total Disbursed",
      value: `Rs ${totalDisbursed.toLocaleString("en-IN")}`,
      icon: "Wallet",
      bgColor: "bg-secondary/10",
      iconColor: "var(--color-secondary)",
    },
    {
      label: "Outstanding Amount",
      value: `Rs ${outstanding.toLocaleString("en-IN")}`,
      icon: "FileMinus",
      bgColor: "bg-warning/10",
      iconColor: "var(--color-warning)",
    },
    {
      label: "Collected Amount",
      value: `Rs ${totalCollected.toLocaleString("en-IN")}`,
      icon: "Banknote",
      bgColor: "bg-success/10",
      iconColor: "var(--color-success)",
    },
    {
      label: "Collection Rate",
      value: `${collectionRate.toFixed(1)}%`,
      icon: "Target",
      bgColor: "bg-blue-500/10",
      iconColor: "rgb(37 99 235)",
    },
    {
      label: "Overdue Accounts",
      value: overdueAccounts.toLocaleString("en-IN"),
      icon: "AlertCircle",
      bgColor: "bg-error/10",
      iconColor: "var(--color-error)",
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-5 md:p-6 mb-5 md:mb-6">
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
        Performance Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {metricCards.map((metric) => (
          <div
            key={metric.label}
            className="bg-background rounded-xl p-4 md:p-5 border border-border hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border border-border/60 ${metric.bgColor} flex items-center justify-center`}
              >
                <Icon name={metric.icon} size={20} color={metric.iconColor} />
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">{metric.label}</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
