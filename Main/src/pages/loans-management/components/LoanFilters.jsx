import React from "react";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";

const LoanFilters = ({
  filters,
  branches,
  onFilterChange,
  showBranchFilter = true,
}) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const collectionDayOptions = [
    { value: "all", label: "All Days" },
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
    { value: "SAT", label: "Saturday" },
    { value: "SUN", label: "Sunday" },
  ];

  const repaymentTypeOptions = [
    { value: "all", label: "All Repayment" },
    { value: "DAILY", label: "Daily" },
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONTHLY", label: "Monthly" },
  ];

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Select
          label="Status"
          value={filters?.status}
          onChange={(value) => handleChange("status", value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "ACTIVE", label: "Active" },
            { value: "OVERDUE", label: "Overdue" },
            { value: "CLOSED", label: "Closed" },
            { value: "PENDING_APPROVAL", label: "Pending Approval" },
            { value: "REJECTED", label: "Rejected" },
          ]}
        />

        {showBranchFilter ? (
          <Select
            label="Branch"
            value={filters?.branch}
            onChange={(value) => handleChange("branch", value)}
            options={[
              { value: "all", label: "All Branches" },
              ...(branches || []).map((branch) => ({
                value: branch?.id,
                label: branch?.branch_name,
              })),
            ]}
          />
        ) : null}

        <Select
          label="Loan Type"
          value={filters?.loanType}
          onChange={(value) => handleChange("loanType", value)}
          options={[
            { value: "all", label: "All Types" },
            { value: "personal", label: "Personal Loan" },
            { value: "business", label: "Business Loan" },
            { value: "gold", label: "Gold Loan" },
            { value: "vehicle", label: "Vehicle Loan" },
          ]}
        />

        <Select
          label="Repayment Type"
          value={filters?.repaymentType}
          onChange={(value) => handleChange("repaymentType", value)}
          options={repaymentTypeOptions}
        />

        {/* NEW COLLECTION DAY FILTER */}
        <Select
          label="Collection Day"
          value={filters?.collectionDay}
          onChange={(value) => handleChange("collectionDay", value)}
          options={collectionDayOptions}
        />

        <div className="flex items-end">
          <button
            onClick={() =>
              onFilterChange({
                status: "all",
                branch: "all",
                loanType: "all",
                collectionDay: "all",
                repaymentType: "all", // ✅ ADD
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
          onChange={(e) => handleChange("searchQuery", e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default LoanFilters;
