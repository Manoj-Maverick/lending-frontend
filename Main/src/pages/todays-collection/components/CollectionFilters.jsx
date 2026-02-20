import React from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

const CollectionFilters = ({
  searchTerm,
  onSearchChange,
  branches,
  selectedBranch,
  onBranchChange,
  onReset,
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Search
          </label>
          <Input
            placeholder="Search name, loan, phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Branch
          </label>
          <Select
            value={selectedBranch}
            onChange={onBranchChange}
            options={branches}
          />
        </div>

        <div>
          <Button variant="default" className="w-full" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionFilters;
