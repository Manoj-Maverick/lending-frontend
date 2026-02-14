import React from "react";
import Icon from "../../../components/AppIcon";
import { useFetchBranchPerformanceMetricsByID } from "hooks/branch.deatils.page.hooks/useGetSpecificBranchPerformanceMetrics";

const PerformanceMetrics = ({ branchId, metrics }) => {
  const { data, isLoading } = useFetchBranchPerformanceMetricsByID(branchId);
  if (isLoading) return <div>Loading branch data</div>;
  const metricCards = [
    {
      label: "Total Clients",
      value: data?.total_clients,
      icon: "Users",
      color: "primary",
      bgColor: "bg-primary/10",
      iconColor: "var(--color-primary)",
    },
    {
      label: "Active Loans",
      value: data?.active_loans,
      icon: "Wallet",
      color: "accent",
      bgColor: "bg-accent/10",
      iconColor: "var(--color-accent)",
    },
    {
      label: "Total Disbursed",
      value: `₹${Math.floor(data?.total_disbursed)?.toLocaleString("en-IN")}`,
      icon: "Wallet",
      color: "secondary",
      bgColor: "bg-secondary/10",
      iconColor: "var(--color-secondary)",
    },
    {
      label: "Outstanding Amount",
      value: `₹${Math.floor(data?.outstanding)?.toLocaleString("en-IN")}`,
      icon: "FileMinus",
      color: "warning",
      bgColor: "bg-warning/10",
      iconColor: "var(--color-warning)",
    },
    {
      label: "Collected Amount",
      value: `₹${Math.floor(data?.total_collected)?.toLocaleString("en-IN")}`,
      icon: "Wallet",
      color: "warning",
      bgColor: "bg-warning/10",
      iconColor: "var(--color-warning)",
    },
    {
      label: "Collection Rate",
      value: `${(Math.floor(data?.total_collected) / Math.floor(data?.total_disbursed)) * 100}%`,
      icon: "Target",
      color: "success",
      bgColor: "bg-success/10",
      iconColor: "var(--color-success)",
    },
    {
      label: "Overdue Accounts",
      value: 3,
      icon: "AlertCircle",
      color: "error",
      bgColor: "bg-error/10",
      iconColor: "var(--color-error)",
    },
  ];

  return (
    <div className="bg-card rounded-lg shadow-elevation-sm p-4 md:p-6 mb-4 md:mb-6">
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
        Performance Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {metricCards?.map((metric, index) => (
          <div
            key={index}
            className="bg-background rounded-lg p-4 md:p-5 border border-border hover:shadow-elevation-md transition-smooth"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${metric?.bgColor} flex items-center justify-center`}
              >
                <Icon name={metric?.icon} size={20} color={metric?.iconColor} />
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
              {metric?.label}
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
              {metric?.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
