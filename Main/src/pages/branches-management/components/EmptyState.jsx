import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const EmptyState = ({ onAddBranch, hasFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-full flex items-center justify-center mb-4 md:mb-6">
        <Icon
          name={hasFilters ? "Search" : "Building2"}
          size={40}
          className="text-muted-foreground"
        />
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
        {hasFilters ? "No branches found" : "No branches yet"}
      </h3>
      <p className="text-sm md:text-base text-muted-foreground text-center max-w-md mb-6">
        {hasFilters
          ? "Try adjusting your search or filter criteria to find what you are looking for."
          : "Get started by creating your first branch location to begin managing your lending operations."}
      </p>
      {!hasFilters && (
        <Button
          variant="default"
          onClick={onAddBranch}
          iconName="Plus"
          iconPosition="left"
        >
          Add First Branch
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
