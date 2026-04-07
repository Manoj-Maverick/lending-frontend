import React from "react";
import Icon from "../../../components/AppIcon";
import Select from "../../../components/ui/Select";
import { useUIContext } from "context/UIContext";

const StaffScopeFilters = ({
  filters,
  onFilterChange,
  showBranchFilter = true,
}) => {
  const { branches } = useUIContext();

  const branchOptions = [
    { value: "all", label: "All Branches" },
    ...branches?.map((branch) => ({
      value: branch?.id,
      label: branch?.branch_name,
    })),
  ];

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "BRANCH_MANAGER", label: "Branch Manager" },
    { value: "STAFF", label: "Staff" },
  ];

  return (
    <div className="relative z-[120] mb-6 overflow-visible rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon name="Filter" size={18} className="text-primary" />
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Filter Staff Scope
          </h2>
          <p className="text-sm text-muted-foreground">
            Limit attendance and salary views by branch and role.
          </p>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 gap-4 ${showBranchFilter ? "md:grid-cols-2" : "md:grid-cols-1"}`}
      >
        {showBranchFilter ? (
          <Select
            label="Branch"
            placeholder="Select branch"
            options={branchOptions}
            value={filters?.branch}
            onChange={(value) => onFilterChange("branch", value)}
            searchable
            className="relative z-[140]"
            dropdownPlacement="top"
          />
        ) : null}

        <Select
          label="Role"
          placeholder="Select role"
          options={roleOptions}
          value={filters?.role}
          onChange={(value) => onFilterChange("role", value)}
          className="relative z-[140]"
          dropdownPlacement="top"
        />
      </div>
    </div>
  );
};

export default StaffScopeFilters;
