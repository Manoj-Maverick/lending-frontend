import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useUIContext } from "context/UIContext";

const StaffFilters = ({
  filters,
  onFilterChange,
  totalStaff,
  filteredCount,
}) => {
  const { branches } = useUIContext();
  const branchOptions = [
    { value: "all", label: "All Branches" },
    ...branches?.map((b) => ({ value: b?.id, label: b?.branch_name })),
  ];
  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "BRANCH_MANAGER", label: "Branch Manager" },
    { value: "ACCOUNTANT", label: "Accountant" },
    { value: "STAFF", label: "Staff" },
    {
      value: "Customer Service Executive",
      label: "Customer Service Executive",
    },
    { value: "HR Executive", label: "HR Executive" },
    { value: "IT Manager", label: "IT Manager" },
    { value: "Audit Officer", label: "Audit Officer" },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h2 className="text-base md:text-lg font-semibold text-foreground">
            Filter Staff
          </h2>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-accent">{filteredCount}</span> of{" "}
          <span className="font-semibold text-foreground">{totalStaff}</span>{" "}
          staff members
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search by name, email, phone, or code..."
            value={filters?.search}
            onChange={(e) => onFilterChange("search", e?.target?.value)}
            className="w-full"
          />
        </div>

        <Select
          placeholder="Select branch"
          options={branchOptions}
          value={filters?.branch}
          onChange={(value) => onFilterChange("branch", value)}
        />

        <Select
          placeholder="Select role"
          options={roleOptions}
          value={filters?.role}
          onChange={(value) => onFilterChange("role", value)}
        />
      </div>
      {(filters?.search ||
        filters?.branch !== "all" ||
        filters?.role !== "all") && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs md:text-sm text-muted-foreground">
            Active filters:
          </span>
          {filters?.search && (
            <button
              onClick={() => onFilterChange("search", "")}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs hover:bg-accent/20 transition-colors"
            >
              Search: {filters?.search}
              <Icon name="X" size={12} />
            </button>
          )}
          {filters?.branch !== "all" && (
            <button
              onClick={() => onFilterChange("branch", "all")}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs hover:bg-accent/20 transition-colors"
            >
              Branch:{" "}
              {branchOptions?.find((b) => b?.value === filters?.branch)?.label}
              <Icon name="X" size={12} />
            </button>
          )}
          {filters?.role !== "all" && (
            <button
              onClick={() => onFilterChange("role", "all")}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs hover:bg-accent/20 transition-colors"
            >
              Role:{" "}
              {roleOptions?.find((r) => r?.value === filters?.role)?.label}
              <Icon name="X" size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffFilters;
