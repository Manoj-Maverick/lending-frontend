import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useFetchBranchById } from "hooks/branch.details.page.hooks/useGetSpecificBranch";

const BranchHeader = ({ branchId, branch, onEdit, onStatusToggle }) => {
  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400";
      case "inactive":
        return "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300";
      case "warning":
        return "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300";
    }
  };

  const { data, isLoading } = useFetchBranchById(branchId);
  if (isLoading) return <div className="p-6 bg-card rounded-xl border border-border">Loading branch...</div>;

  const statusText = data?.is_active ? "Active" : "Inactive";
  const statusTone = getStatusColor(statusText);

  return (
    <div className="relative overflow-hidden bg-card rounded-2xl border border-border shadow-sm p-5 md:p-7 lg:p-8 mb-5 md:mb-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 md:mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Icon name="Building2" size={22} className="text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground truncate">
                {data?.branch_name}
              </h1>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs md:text-sm font-medium ${statusTone}`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              {statusText}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="MapPin" size={20} color="var(--color-primary)" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Location
                </p>
                <p className="text-sm md:text-base font-medium text-foreground line-clamp-2">
                  {data?.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={20} color="var(--color-accent)" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Branch Manager
                </p>
                <p className="text-sm md:text-base font-medium text-foreground line-clamp-1">
                  {data?.manager?.name == null
                    ? "Not Assigned"
                    : data?.manager?.name}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Phone" size={20} color="var(--color-secondary)" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Branch Contact
                </p>
                <p className="text-sm md:text-base font-medium text-foreground">
                  +91 {data?.branch_mobile}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Phone" size={20} color="var(--color-secondary)" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Branch Manager Contact
                </p>
                <p
                  className={`text-sm md:text-base font-medium text-foreground ${data?.manager?.phone == null ? "text-center" : ""}`}
                >
                  {data?.manager?.phone == null
                    ? "-"
                    : `+91 ${data?.manager?.phone}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col gap-2 md:gap-3 lg:min-w-[160px]">
          <Button
            variant="outline"
            iconName="Edit"
            iconPosition="left"
            onClick={onEdit}
            className="flex-1 sm:flex-none"
          >
            Edit Details
          </Button>
          <Button
            variant={
              branch?.status?.toLowerCase() === "active"
                ? "destructive"
                : "success"
            }
            iconName={
              branch?.status?.toLowerCase() === "active"
                ? "XCircle"
                : "CheckCircle"
            }
            iconPosition="left"
            onClick={onStatusToggle}
            className="flex-1 sm:flex-none"
          >
            {branch?.status?.toLowerCase() === "active"
              ? "Deactivate"
              : "Activate"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BranchHeader;
