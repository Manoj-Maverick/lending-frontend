import React from "react";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

const CollectionFilters = ({
  search,
  onSearchChange,
  branchOptions,
  branch,
  onBranchChange,
  onReset,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <div className="relative">
          <Icon
            name="Search"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Search name, loan, phone..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Select value={branch} onChange={onBranchChange} options={branchOptions} />

      <div>
        <Button variant="default" className="w-full" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CollectionFilters;
