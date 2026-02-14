import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const GuarantorsTab = ({ guarantors, onAddGuarantor }) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground">
            Guarantors
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage client guarantor information
          </p>
        </div>
        <Button
          variant="default"
          iconName="UserPlus"
          iconPosition="left"
          onClick={onAddGuarantor}
          className="w-full sm:w-auto"
        >
          Add Guarantor
        </Button>
      </div>
      {guarantors?.length === 0 ? (
        <div className="bg-card rounded-lg p-8 md:p-12 text-center shadow-elevation-sm">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <Icon name="Users" size={32} className="text-muted-foreground" />
          </div>
          <h4 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            No Guarantors Added
          </h4>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Add guarantor information to complete the client profile
          </p>
          <Button
            variant="outline"
            iconName="UserPlus"
            iconPosition="left"
            onClick={onAddGuarantor}
          >
            Add First Guarantor
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {guarantors?.map((guarantor) => (
            <div
              key={guarantor?.id}
              className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm hover:shadow-elevation-md transition-shadow duration-250"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex justify-center sm:justify-start">
                  <Image
                    src={guarantor?.photo}
                    alt={guarantor?.photoAlt}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold text-foreground">
                      {guarantor?.name}
                    </h4>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {guarantor?.relationship}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        name="Phone"
                        size={16}
                        className="text-muted-foreground flex-shrink-0"
                      />
                      <span className="text-sm md:text-base text-foreground">
                        {guarantor?.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        name="Mail"
                        size={16}
                        className="text-muted-foreground flex-shrink-0"
                      />
                      <span className="text-sm md:text-base text-foreground truncate">
                        {guarantor?.email}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon
                        name="MapPin"
                        size={16}
                        className="text-muted-foreground flex-shrink-0 mt-1"
                      />
                      <span className="text-sm md:text-base text-foreground">
                        {guarantor?.address}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Occupation
                        </p>
                        <p className="text-sm font-medium text-foreground mt-1">
                          {guarantor?.occupation}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Monthly Income
                        </p>
                        <p className="text-sm font-medium text-foreground mt-1">
                          ${guarantor?.monthlyIncome?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Edit"
                      iconPosition="left"
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      iconPosition="left"
                      className="flex-1"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuarantorsTab;
