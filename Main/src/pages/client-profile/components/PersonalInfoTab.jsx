import React, { useMemo } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { useCustomerProfile } from "../../../hooks/clients.profile.page.hooks/useGetClientProfileInfo";

const PersonalInfoTab = ({ customerId: clientId, onEdit }) => {
  const {
    data: client,
    isLoading,
    isError,
    error,
  } = useCustomerProfile(clientId);

  const avatarUrl = useMemo(() => {
    const id = client?.id;
    const gender = client?.gender;

    if (!id) return "/images/avatar-placeholder.png";

    const seed = Number(id) % 100 || 1;
    if (gender?.toLowerCase() === "male") {
      return `https://randomuser.me/api/portraits/men/${seed}.jpg`;
    }
    if (gender?.toLowerCase() === "female") {
      return `https://randomuser.me/api/portraits/women/${seed}.jpg`;
    }
    return "/images/avatar-placeholder.png";
  }, [client?.id, client?.gender]);

  if (!clientId) return null;

  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Loading profile...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-destructive">
        Failed to load profile: {error?.message || "Unknown error"}
      </div>
    );
  }

  if (!client) return null;

  const {
    name,
    id,
    code,
    phone,
    email,
    branch,
    memberSince,
    dateOfBirth,
    gender,
    maritalStatus,
    occupation,
    monthlyIncome,
    kyc,
    address,
    bankInfo,
    stats,
  } = client;

  // 🔹 Stable random avatar based on gender + id

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Profile Header */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <Image
                src={avatarUrl}
                alt="Client"
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-lg object-cover"
              />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                  {name}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Client ID: {code || id}
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
              <InfoItem
                icon="Phone"
                color="var(--color-primary)"
                bg="bg-primary/10"
                label="Phone Number"
                value={phone || "-"}
              />
              <InfoItem
                icon="Mail"
                color="var(--color-accent)"
                bg="bg-accent/10"
                label="Email Address"
                value={email || "-"}
              />
              <InfoItem
                icon="Building2"
                color="var(--color-secondary)"
                bg="bg-secondary/10"
                label="Branch"
                value={branch || "-"}
              />
              <InfoItem
                icon="Calendar"
                color="var(--color-warning)"
                bg="bg-warning/10"
                label="Member Since"
                value={
                  memberSince ? new Date(memberSince).toLocaleDateString() : "-"
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <Section title="Personal Details">
        <Detail label="Date of Birth" value={dateOfBirth || "-"} />
        <Detail label="Gender" value={gender || "-"} />
        <Detail label="Marital Status" value={maritalStatus || "-"} />
        <Detail label="Occupation" value={occupation || "-"} />
        <Detail
          label="Monthly Income"
          value={
            monthlyIncome != null
              ? `₹ ${Number(monthlyIncome).toLocaleString()}`
              : "-"
          }
        />
        <Detail
          label="KYC"
          value={
            <>
              <div>Aadhaar: **** {kyc?.aadhaarLast4 || "----"}</div>
              <div>PAN: **** {kyc?.panLast4 || "----"}</div>
            </>
          }
        />
      </Section>

      {/* Address Information */}
      <Section title="Address Information">
        <Detail label="Street Address" value={address?.street || "-"} />
        <Detail label="City" value={address?.city || "-"} />
        <Detail label="State" value={address?.state || "-"} />
        <Detail label="ZIP Code" value={address?.zipCode || "-"} />
      </Section>

      {/* Bank Information */}
      <Section title="Bank Information">
        <Detail label="Bank Name" value={bankInfo?.bankName || "-"} />
        <Detail label="Account Number" value={bankInfo?.accountNumber || "-"} />
        <Detail
          label="Account Holder Name"
          value={bankInfo?.accountHolderName || "-"}
        />
        <Detail label="IFSC Code" value={bankInfo?.ifscCode || "-"} />
      </Section>

      <Section title="Account Status">
        <div
          className="
      grid 
      gap-4 md:gap-6
      [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]
    "
        >
          <StatCard
            label="Total Loans"
            value={stats?.totalLoans || 0}
            color="primary"
          />
          <StatCard
            label="Active Loans"
            value={stats?.activeLoans || 0}
            color="success"
          />
          <StatMoneyCard
            label="Total Disbursed"
            amount={stats?.totalDisbursed || 0}
            color="accent"
          />
          <StatMoneyCard
            label="Outstanding"
            amount={stats?.outstanding || 0}
            color="warning"
          />
        </div>
      </Section>
    </div>
  );
};

/* Helper components */

const Section = ({ title, children }) => (
  <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm">
    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {children}
    </div>
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <label className="text-xs md:text-sm text-muted-foreground">{label}</label>
    <div className="text-sm md:text-base font-medium text-foreground mt-1">
      {value || "-"}
    </div>
  </div>
);

const InfoItem = ({ icon, color, bg, label, value }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
    >
      <Icon name={icon} size={20} color={color} />
    </div>
    <div className="min-w-0">
      <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
      <p className="text-sm md:text-base font-medium text-foreground truncate">
        {value}
      </p>
    </div>
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div className={`bg-${color}/5 rounded-lg p-4 min-w-[160px]`}>
    <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
    <p className={`text-2xl md:text-3xl font-semibold text-${color} mt-2`}>
      {value}
    </p>
  </div>
);

const StatMoneyCard = ({ label, amount, color }) => (
  <div className={`bg-${color}/5 rounded-lg p-4 min-w-[160px]`}>
    <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
    <div
      className={`mt-2 text-${color} text-2xl md:text-3xl font-semibold inline-flex items-baseline gap-1 whitespace-nowrap`}
    >
      <span>₹</span>
      <span>{Number(amount).toLocaleString()}</span>
    </div>
  </div>
);

export default PersonalInfoTab;
