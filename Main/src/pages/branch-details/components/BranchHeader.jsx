import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useFetchBranchById } from "hooks/branch.details.page.hooks/useGetSpecificBranch";
const BranchHeader = ({ branchId, branch, onEdit, onStatusToggle }) => {
  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "inactive":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      case "warning":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const { data, isLoading } = useFetchBranchById(branchId);
  if (isLoading) return <div>Loading branch...</div>;

  return (
    <div className="bg-card rounded-lg shadow-elevation-sm p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 md:mb-4">
            <div className="flex items-center gap-3">
              <Icon name="Building2" size={32} className="text-primary" />
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                {data?.branch_name}
              </h1>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(branch?.status)}`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              {data?.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
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
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
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
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
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
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
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

        <div className="flex flex-row sm:flex-col gap-2 md:gap-3">
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
