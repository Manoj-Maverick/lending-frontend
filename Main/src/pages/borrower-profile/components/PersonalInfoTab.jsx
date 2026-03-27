import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { useBorrowerDetails } from "hooks/borrowers/useBorrowerDetails";
import { API_BASE_URL } from "api/client";
import DocumentSection from "./DocumentSection";
import { useDeleteDocument } from "hooks/docs/useDeleteDoc";
import { useToggleBlock } from "hooks/borrowers/useBlockBorrower";
import { useUploadWithProgress } from "hooks/docs/useUploadWithProgress";
import { Skeleton } from "components/ui/Skeleton";
const PersonalInfoTab = ({ borrowerId, onEdit }) => {
  const {
    data: borrower,
    isLoading,
    isError,
    error,
  } = useBorrowerDetails(borrowerId);
  const hashString = (value = "") => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };
  const toApiAssetUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };
  const getBorrowerAvatar = (borrower) => {
    if (borrower?.photo_url) return toApiAssetUrl(borrower.photo_url);
    const base = `${borrower?.id || ""}-${borrower?.name || borrower?.client_name || ""}`;
    const seed = (hashString(base) % 70) + 1;
    return `https://i.pravatar.cc/150?img=${seed}`;
  };
  const { mutateAsync: deleteDoc } = useDeleteDocument();
  const { mutate: toggleBlock, isPending: isBlocking } = useToggleBlock();
  const { uploadDocument } = useUploadWithProgress();
  const isBlocked = borrower?.is_blocked;

  const handleUpload = async ({ file, document_type, onProgress, signal }) => {
    return uploadDocument({
      file,
      category: "customer",
      document_type,
      entity_id: borrowerId,
      onProgress,
      signal,
    });
  };
  const handleDelete = async (docId) => {
    await deleteDoc({
      id: docId,
      category: "customer",
      entity_id: borrowerId,
    });
  };

  const verifyPassword = async (password) => {
    // 🔴 Replace with real API later
    return password === "admin123";
  };
  if (!borrowerId) return null;

  if (isLoading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="rounded-lg bg-card p-4 shadow-elevation-sm md:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <Skeleton className="h-32 w-32 rounded-lg md:h-40 md:w-40 lg:h-48 lg:w-48" />
            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-56 md:h-10 md:w-72" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-28 rounded-xl" />
                  <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-2 rounded-lg border border-border p-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-destructive">
        Failed to load profile: {error?.message || "Unknown error"}
      </div>
    );
  }

  if (!borrower) return null;

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
  } = borrower;

  // 🔹 Stable random avatar based on gender + id

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Profile Header */}
      <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-elevation-sm">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <Image
                src={getBorrowerAvatar(borrower)}
                alt="Borrower"
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-lg object-cover"
              />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                    {name}
                  </h2>

                  {borrower?.is_blocked && (
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                      Blocked
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Borrower ID: {code || id}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  iconName="Edit"
                  iconPosition="left"
                  onClick={onEdit}
                >
                  Edit Profile
                </Button>

                <Button
                  variant={isBlocked ? "success" : "destructive"}
                  iconName={
                    isBlocking ? "Loader" : isBlocked ? "Unlock" : "Ban"
                  }
                  onClick={() =>
                    toggleBlock({
                      borrowerId: borrowerId,
                      isBlocked: !isBlocked,
                    })
                  }
                  disabled={isBlocking}
                >
                  {isBlocking
                    ? isBlocked
                      ? "Unblocking"
                      : "Blocking"
                    : isBlocked
                      ? "Unblock"
                      : "Block"}
                </Button>
              </div>
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
        <Detail
          label="Date of Birth"
          value={dateOfBirth.split("T")[0] || "-"}
        />
        <Detail label="Gender" value={gender || "-"} />
        <Detail label="Marital Status" value={maritalStatus || "-"} />
        <Detail label="Occupation" value={occupation || "-"} />
        <Detail
          label="Monthly Income"
          value={
            monthlyIncome != null
              ? `Rs ${Number(monthlyIncome).toLocaleString()}`
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

      <DocumentSection
        category="customer"
        borrowerId={borrowerId}
        onUpload={handleUpload}
        onDelete={handleDelete}
        verifyPassword={verifyPassword}
      />
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
  <div className={`bg-${color}/5 rounded-lg p-4 min-w-0`}>
    <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
    <p className={`text-2xl md:text-3xl font-semibold text-${color} mt-2`}>
      {value}
    </p>
  </div>
);

const StatMoneyCard = ({ label, amount, color }) => (
  <div className={`bg-${color}/5 rounded-lg p-4 min-w-0`}>
    <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
    <div
      className={`mt-2 text-${color} text-2xl md:text-3xl font-semibold inline-flex items-baseline gap-1 flex-wrap`}
    >
      <span>Rs</span>
      <span>{Number(amount).toLocaleString()}</span>
    </div>
  </div>
);

export default PersonalInfoTab;
