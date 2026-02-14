import React from "react";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";

const LoanFilters = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Status"
          value={filters?.status}
          onChange={(e) => handleChange("status", e?.target?.value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "overdue", label: "Overdue" },
            { value: "closed", label: "Closed" },
            { value: "pending", label: "Pending Approval" },
          ]}
        />
        <Select
          label="Branch"
          value={filters?.branch}
          onChange={(e) => handleChange("branch", e?.target?.value)}
          options={[
            { value: "all", label: "All Branches" },
            { value: "main", label: "Main Branch" },
            { value: "east", label: "East Branch" },
            { value: "west", label: "West Branch" },
            { value: "north", label: "North Branch" },
          ]}
        />
        <Select
          label="Loan Type"
          value={filters?.loanType}
          onChange={(e) => handleChange("loanType", e?.target?.value)}
          options={[
            { value: "all", label: "All Types" },
            { value: "personal", label: "Personal Loan" },
            { value: "business", label: "Business Loan" },
            { value: "gold", label: "Gold Loan" },
            { value: "vehicle", label: "Vehicle Loan" },
          ]}
        />
        <div className="flex items-end">
          <button
            onClick={() =>
              onFilterChange({
                status: "all",
                branch: "all",
                loanType: "all",
                searchQuery: "",
              })
            }
            className="w-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
          >
            <Icon name="RotateCcw" size={14} className="inline mr-2" />
            Reset Filters
          </button>
        </div>
      </div>
      <div className="relative">
        <Icon
          name="Search"
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder="Search by loan ID, client name, or client code..."
          value={filters?.searchQuery}
          onChange={(e) => handleChange("searchQuery", e?.target?.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default LoanFilters;
