import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const PersonalInfoTab = ({ staff, onEdit }) => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Profile Header */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm border border-border">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <Image
                src={staff?.photo}
                alt={staff?.photoAlt}
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-lg object-cover"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-2 px-2 py-1 rounded-full bg-card border border-border">
                <div
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${
                    staff?.status === "Active" ? "bg-success" : "bg-muted"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    staff?.status === "Active"
                      ? "text-success"
                      : "text-muted-foreground"
                  }`}
                >
                  {staff?.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                  {staff?.name}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Staff ID: {staff?.id}
                </p>
              </div>
              <Button
                variant="outline"
                iconName="Edit"
                iconPosition="left"
                onClick={onEdit}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Phone" size={20} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="text-sm md:text-base font-medium text-foreground truncate">
                    {staff?.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Mail" size={20} className="text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Email Address
                  </p>
                  <p className="text-sm md:text-base font-medium text-foreground truncate">
                    {staff?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Briefcase" size={20} className="text-secondary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Role
                  </p>
                  <p className="text-sm md:text-base font-medium text-foreground truncate">
                    {staff?.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Building2" size={20} className="text-warning" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Branch
                  </p>
                  <p className="text-sm md:text-base font-medium text-foreground truncate">
                    {staff?.branch}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon
                    name="Calendar"
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Employed Since
                  </p>
                  <p className="text-sm md:text-base font-medium text-foreground">
                    {staff?.employedSince}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    staff?.status === "Active" ? "bg-success/10" : "bg-error/10"
                  }`}
                >
                  <Icon
                    name="CheckCircle"
                    size={20}
                    className={
                      staff?.status === "Active" ? "text-success" : "text-error"
                    }
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${
                      staff?.status === "Active"
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                    }`}
                  >
                    {staff?.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm border border-border">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
          Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Date of Birth
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.dateOfBirth}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Gender
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.gender}
            </p>
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm border border-border">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Department
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.department}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Employment Type
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.employmentType}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Join Date
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.joinDate}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Years of Experience
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.stats?.yearsOfExperience} years
            </p>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm border border-border">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="md:col-span-2">
            <label className="text-xs md:text-sm text-muted-foreground">
              Street Address
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.address?.street}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              City
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.address?.city}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              State / Province
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.address?.state}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Zip Code
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.address?.zipCode}
            </p>
          </div>
        </div>
      </div>

      {/* Bank Information */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm border border-border">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
          Bank Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Bank Name
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.bankInfo?.bankName}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Account Holder Name
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.bankInfo?.accountHolderName}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Account Number
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.bankInfo?.accountNumber}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              IFSC Code
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {staff?.bankInfo?.ifscCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
