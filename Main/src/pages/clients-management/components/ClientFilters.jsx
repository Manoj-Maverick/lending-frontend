import React from "react";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const ClientFilters = ({
  filters,
  onFilterChange,
  totalClients,
  filteredCount,
}) => {
  const branchOptions = [
    { value: "all", label: "All Branches" },
    { value: "br-001", label: "Main Branch" },
    { value: "br-002", label: "North Branch" },
    { value: "br-003", label: "South Branch" },
    { value: "br-004", label: "East Branch" },
    { value: "br-005", label: "West Branch" },
  ];

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "Active", label: "Active Loans" },
    { value: "Closed", label: "Closed Loans" },
    { value: "Delayed", label: "Delayed Payments" },
    { value: "No Loan", label: "No Active Loan" },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h2 className="text-base md:text-lg font-semibold text-foreground">
            Filter Clients
          </h2>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-accent">{filteredCount}</span> of{" "}
          <span className="font-semibold text-foreground">{totalClients}</span>{" "}
          clients
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search by name, phone, or code..."
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
          placeholder="Select status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange("status", value)}
        />

        <Select
          placeholder="Customer Status"
          options={[
            { value: "all", label: "All Customers" },
            { value: "active", label: "Active Customers" },
            { value: "blocked", label: "Blocked Customers" },
          ]}
          value={filters?.blockStatus || "all"}
          onChange={(value) => onFilterChange("blockStatus", value)}
        />
      </div>
      {(filters?.search ||
        filters?.branch !== "all" ||
        filters?.status !== "all") && (
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
          {filters?.status !== "all" && (
            <button
              onClick={() => onFilterChange("status", "all")}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs hover:bg-accent/20 transition-colors"
            >
              Status:{" "}
              {statusOptions?.find((s) => s?.value === filters?.status)?.label}
              <Icon name="X" size={12} />
            </button>
          )}
          {filters?.blockStatus && filters?.blockStatus !== "all" && (
            <button
              onClick={() => onFilterChange("blockStatus", "all")}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs hover:bg-accent/20 transition-colors"
            >
              Customer Status:{" "}
              {filters?.blockStatus === "blocked" ? "Blocked" : "Active"}
              <Icon name="X" size={12} />
            </button>
          )}
          <button
            onClick={() => {
              onFilterChange("search", "");
              onFilterChange("branch", "all");
              onFilterChange("status", "all");
            }}
            className="text-xs text-destructive hover:underline ml-auto"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientFilters;
