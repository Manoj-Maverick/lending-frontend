import React from "react";
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
    ...branches?.map((branch) => ({
      value: branch?.id,
      label: branch?.branch_name,
    })),
  ];

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "ADMIN", label: "Admin" },
    { value: "BRANCH_MANAGER", label: "Branch Manager" },
    { value: "STAFF", label: "Staff" },
  ];

  const selectedBranchLabel =
    branchOptions?.find((b) => b?.value === filters?.branch)?.label ||
    "All Branches";
  const selectedRoleLabel =
    roleOptions?.find((r) => r?.value === filters?.role)?.label || "All Roles";

  return (
    <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Icon name="SlidersHorizontal" size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Filter and Explore
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Narrow results by branch, role, or a quick staff search.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Results
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {filteredCount}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {totalStaff}
            </p>
          </div>
          <div className="col-span-2 rounded-xl border border-border bg-background px-4 py-3 sm:col-span-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Branch
            </p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">
              {selectedBranchLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Input
            type="search"
            label="Search Staff"
            placeholder="Search by name, email, phone, or code..."
            value={filters?.search}
            onChange={(e) => onFilterChange("search", e?.target?.value)}
            className="w-full"
          />
        </div>

        <Select
          label="Branch"
          placeholder="Select branch"
          options={branchOptions}
          value={filters?.branch}
          onChange={(value) => onFilterChange("branch", value)}
          searchable
        />

        <Select
          label="Role"
          placeholder="Select role"
          options={roleOptions}
          value={filters?.role}
          onChange={(value) => onFilterChange("role", value)}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {roleOptions
          .filter((role) => role.value !== "all")
          .map((role) => {
            const active = filters?.role === role.value;

            return (
              <button
                key={role.value}
                type="button"
                onClick={() =>
                  onFilterChange("role", active ? "all" : role.value)
                }
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {role.label}
              </button>
            );
          })}
      </div>

      {(filters?.search ||
        filters?.branch !== "all" ||
        filters?.role !== "all") && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs md:text-sm text-muted-foreground">
            Active filters:
          </span>

          {filters?.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 text-xs text-accent transition-colors hover:bg-accent/20"
            >
              Search: {filters?.search}
              <Icon name="X" size={12} />
            </button>
          )}

          {filters?.branch !== "all" && (
            <button
              type="button"
              onClick={() => onFilterChange("branch", "all")}
              className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 text-xs text-accent transition-colors hover:bg-accent/20"
            >
              Branch: {selectedBranchLabel}
              <Icon name="X" size={12} />
            </button>
          )}

          {filters?.role !== "all" && (
            <button
              type="button"
              onClick={() => onFilterChange("role", "all")}
              className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 text-xs text-accent transition-colors hover:bg-accent/20"
            >
              Role: {selectedRoleLabel}
              <Icon name="X" size={12} />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onFilterChange("search", "");
              onFilterChange("branch", "all");
              onFilterChange("role", "all");
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default StaffFilters;
