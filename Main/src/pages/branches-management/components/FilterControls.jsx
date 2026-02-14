import React from "react";
import Icon from "../../../components/AppIcon";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";

const FilterControls = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "warning", label: "Warning" },
  ];

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "clients-desc", label: "Most Clients" },
    { value: "clients-asc", label: "Least Clients" },
    { value: "collection-desc", label: "Highest Collection Rate" },
    { value: "collection-asc", label: "Lowest Collection Rate" },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search branches..."
            value={filters?.search}
            onChange={(e) => onFilterChange("search", e?.target?.value)}
          />
          <Icon
            name="Search"
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>

        <Select
          placeholder="Filter by status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange("status", value)}
        />

        <Select
          placeholder="Sort by"
          options={sortOptions}
          value={filters?.sortBy}
          onChange={(value) => onFilterChange("sortBy", value)}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {filters?.search && (
          <div className="flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
            <span>Search: {filters?.search}</span>
            <button
              onClick={() => onFilterChange("search", "")}
              className="hover:bg-accent/20 rounded-full p-0.5 transition-colors duration-250"
              aria-label="Clear search"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        )}
        {filters?.status !== "all" && (
          <div className="flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
            <span>
              Status:{" "}
              {
                statusOptions?.find((opt) => opt?.value === filters?.status)
                  ?.label
              }
            </span>
            <button
              onClick={() => onFilterChange("status", "all")}
              className="hover:bg-accent/20 rounded-full p-0.5 transition-colors duration-250"
              aria-label="Clear status filter"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterControls;
