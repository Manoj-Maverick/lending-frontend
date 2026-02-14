import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const BranchCard = ({ branch, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-accent/10 text-accent";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "warning":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return "text-accent";
    if (percentage >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <div
      className="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-elevation-md transition-all duration-250 cursor-pointer group"
      onClick={() => onClick(branch)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e?.key === "Enter" || e?.key === " ") {
          onClick(branch);
        }
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-250">
            <Icon name="Building2" size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
              {branch?.branch_name}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
              <Icon name="MapPin" size={14} />
              {branch?.location}
            </p>
          </div>
        </div>
        <span
          className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            branch?.is_active ? "active" : "inactive",
          )}`}
        >
          {branch?.is_active ? "Active" : "Inactive"}
        </span>
      </div>
      {branch?.is_manager_assigned ? (
        <div className="mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={
                  branch?.manager?.avatar ??
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKu1w7TulWMUKGszjJlb7PDtn0LVSJgGnrog&s"
                }
                alt={branch?.manager?.avatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Branch Manager</p>
              <p className="text-sm font-medium text-foreground truncate">
                {branch?.mgr_name}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Icon name="Phone" size={12} />
            {branch?.mgr_phone}
          </p>
        </div>
      ) : (
        <div className="bg-warning/10 border border-warning/20 rounded-md p-2 flex items-center gap-2">
          <Icon name="AlertCircle" size={14} className="text-warning" />
          <span className="text-sm text-warning font-medium">
            Manager Not Assigned
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Users" size={16} color="var(--color-primary)" />
            <p className="text-xs text-muted-foreground">Clients</p>
          </div>
          <p className="text-lg md:text-xl font-semibold text-foreground">
            {branch?.total_clients}
          </p>
        </div>
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Wallet" size={16} color="var(--color-accent)" />
            <p className="text-xs text-muted-foreground">Active Loans</p>
          </div>
          <p className="text-lg md:text-xl font-semibold text-foreground">
            {branch?.active_loans}
          </p>
        </div>
      </div>
      <div className="space-y-2 md:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs md:text-sm text-muted-foreground">
            Total Disbursed
          </span>
          <span className="text-sm md:text-base font-semibold text-foreground">
            ₹{branch?.total_disbursed.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs md:text-sm text-muted-foreground">
            Outstanding
          </span>
          <span className="text-sm md:text-base font-semibold text-foreground">
            ₹{branch.outstanding.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs md:text-sm text-muted-foreground">
            Collection Rate
          </span>
          <span
            className={`text-sm md:text-base font-semibold ₹{getPerformanceColor(
              branch?.statistics?.collectionRate,
            )}`}
          >
            {(branch?.total_collected / branch?.total_disbursed) * 100}%
          </span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Staff: {branch?.staff_count}
        </span>
        <Icon
          name="ChevronRight"
          size={18}
          className="text-muted-foreground group-hover:text-accent transition-colors duration-250"
        />
      </div>
    </div>
  );
};

export default BranchCard;
