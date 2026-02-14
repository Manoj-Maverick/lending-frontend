import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const PersonalInfoTab = ({ client, onEdit }) => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Profile Header */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <Image
                src={client?.photo}
                alt={client?.photoAlt}
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-lg object-cover"
              />
              <div
                className={`absolute bottom-2 right-2 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-card ${
                  client?.loanStatus === "Active" ? "bg-success" : "bg-muted"
                }`}
              />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                  {client?.name}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Client ID: {client?.id || client?.code}
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
                  <Icon name="Phone" size={20} color="var(--color-primary)" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="text-sm md:text-base font-medium text-foreground truncate">
                    {client?.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Mail" size={20} color="var(--color-accent)" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Email Address
                  </p>
                  <p className="text-sm md:text-base font-medium text-foreground truncate">
                    {client?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Icon
                    name="Building2"
                    size={20}
                    color="var(--color-secondary)"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Branch
                  </p>
                  <p className="text-sm md:text-base font-medium text-foreground truncate">
                    {client?.branch}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Icon
                    name="Calendar"
                    size={20}
                    color="var(--color-warning)"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Member Since
                  </p>
                  <p className="text-sm md:text-base font-medium text-foreground">
                    {client?.memberSince}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Personal Details */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
          Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Date of Birth
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {client?.dateOfBirth}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Gender
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {client?.gender}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Marital Status
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {client?.maritalStatus}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Occupation
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {client?.occupation}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Monthly Income
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              ${client?.monthlyIncome?.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              National ID
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {client?.nationalId}
            </p>
          </div>
        </div>
      </div>
      {/* Address Information */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
          Address Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Street Address
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {client?.address?.street}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <label className="text-xs md:text-sm text-muted-foreground">
                City
              </label>
              <p className="text-sm md:text-base font-medium text-foreground mt-1">
                {client?.address?.city}
              </p>
            </div>
            <div>
              <label className="text-xs md:text-sm text-muted-foreground">
                State
              </label>
              <p className="text-sm md:text-base font-medium text-foreground mt-1">
                {client?.address?.state}
              </p>
            </div>
            <div>
              <label className="text-xs md:text-sm text-muted-foreground">
                ZIP Code
              </label>
              <p className="text-sm md:text-base font-medium text-foreground mt-1">
                {client?.address?.zipCode}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Bank Information */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
          Bank Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Bank Name
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {client?.bankInfo?.bankName}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Account Number
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {client?.bankInfo?.accountNumber}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              Account Holder Name
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {client?.bankInfo?.accountHolderName}
            </p>
          </div>
          <div>
            <label className="text-xs md:text-sm text-muted-foreground">
              IFSC Code
            </label>
            <p className="text-sm md:text-base font-medium text-foreground mt-1">
              {client?.bankInfo?.ifscCode}
            </p>
          </div>
        </div>
      </div>
      {/* Account Status */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
          Account Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-primary/5 rounded-lg p-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              Total Loans
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-primary mt-2">
              {client?.stats?.totalLoans}
            </p>
          </div>
          <div className="bg-success/5 rounded-lg p-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              Active Loans
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-success mt-2">
              {client?.stats?.activeLoans}
            </p>
          </div>
          <div className="bg-accent/5 rounded-lg p-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              Total Disbursed
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-accent mt-2">
              ${client?.stats?.totalDisbursed?.toLocaleString()}
            </p>
          </div>
          <div className="bg-warning/5 rounded-lg p-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              Outstanding
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-warning mt-2">
              ${client?.stats?.outstanding?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
