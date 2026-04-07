import React, { useMemo } from "react";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import { useBranchesList } from "hooks/branches/useBranchesList";

const ExpenseFilters = ({
  filters,
  onFilterChange,
  categories = [],
  branchLocked = false,
}) => {
  const { data: branchesResponse } = useBranchesList({
    page: 1,
    limit: 100,
    search: "",
    status: "all",
    sortBy: "name-asc",
  });

  const branchOptions = useMemo(
    () => [
      { value: "", label: "All branches" },
      ...((branchesResponse?.data ?? []).map((branch) => ({
        value: String(branch.id),
        label: branch.branch_name,
      })) || []),
    ],
    [branchesResponse?.data],
  );

  const categoryOptions = [
    { value: "", label: "All categories" },
    ...categories.map((category) => ({
      value: String(category.id),
      label: category.name,
    })),
  ];

  return (
    <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Select
          label="Branch"
          value={filters.branch_id}
          onChange={(value) => onFilterChange("branch_id", value)}
          options={branchOptions}
          disabled={branchLocked}
        />

        <Select
          label="Category"
          value={filters.category_id}
          onChange={(value) => onFilterChange("category_id", value)}
          options={categoryOptions}
        />

        <Input
          label="Start Date"
          type="date"
          value={filters.start_date}
          onChange={(event) => onFilterChange("start_date", event.target.value)}
        />

        <Input
          label="End Date"
          type="date"
          value={filters.end_date}
          onChange={(event) => onFilterChange("end_date", event.target.value)}
        />
      </div>
    </div>
  );
};

export default ExpenseFilters;
