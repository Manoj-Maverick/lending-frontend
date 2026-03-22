import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import DocumentSection from "./DocumentSection";
import { useBorrowerGuarantors } from "hooks/borrowers/useBorrowerDetails";
import { useUploadWithProgress } from "hooks/docs/useUploadWithProgress";
import { useDeleteDocument } from "hooks/docs/useDeleteDoc";
import { Skeleton } from "components/ui/Skeleton";

const GuarantorsTab = ({
  borrowerId,
  onAddGuarantor,
  isBlocked,
  showToast,
}) => {
  const {
    data: guarantors = [],
    isLoading,
    isError,
    error,
  } = useBorrowerGuarantors(borrowerId);

  const { mutateAsync: deleteDoc } = useDeleteDocument();
  const { uploadDocument } = useUploadWithProgress();

  // ✅ Upload handler with progress tracking
  const handleUpload = async ({
    file,
    document_type,
    onProgress,
    signal,
    guarantor,
  }) => {
    return uploadDocument({
      file,
      category: "guarantor",
      document_type,
      entity_id: guarantor.id,
      onProgress,
      signal,
    });
  };

  const handleDelete = async (docId, guarantorId) => {
    await deleteDoc({
      id: docId,
      category: "guarantor",
      entity_id: guarantorId,
    });
  };

  const verifyPassword = async (password) => {
    return password === "admin123";
  };

  // ✅ Avatar per guarantor (FIXED)
  const getAvatar = (id) => {
    const seed = Number(id) % 100 || 1;
    return `https://randomuser.me/api/portraits/men/${seed}.jpg`;
  };

  // Loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-6 rounded-lg bg-card p-6 shadow">
            <div className="flex flex-col gap-6 md:flex-row">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-4 w-44" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load guarantors: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground">
            Guarantors
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage borrower guarantor information
          </p>
        </div>

        <Button
          variant="default"
          iconName="UserPlus"
          iconPosition="left"
          onClick={() => {
            isBlocked?.is_blocked
              ? showToast("Borrower is Blocked cannot add guarantor", "blocked")
              : "";
          }}
        >
          Add Guarantor
        </Button>
      </div>

      {/* Empty */}
      {guarantors.length === 0 ? (
        <div className="bg-card rounded-lg p-10 text-center shadow">
          <Icon name="Users" size={40} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No Guarantors Added</p>
        </div>
      ) : (
        <div className="space-y-6">
          {guarantors.map((guarantor) => (
            <div
              key={guarantor.id}
              className="bg-card rounded-lg p-6 shadow space-y-6"
            >
              {/* Guarantor Info */}
              <div className="flex flex-col md:flex-row gap-6">
                <Image
                  src={guarantor.photo || getAvatar(guarantor.id)}
                  alt={guarantor.full_name}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-xl font-semibold">
                      {guarantor.full_name}
                    </h4>
                    <p className="text-muted-foreground">
                      {guarantor.relation}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Phone" size={16} />
                      {guarantor.phone}
                    </div>

                    {guarantor.email && (
                      <div className="flex items-center gap-2">
                        <Icon name="Mail" size={16} />
                        {guarantor.email}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Occupation</p>
                      <p>{guarantor.occupation || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Income</p>
                      <p>
                        {guarantor.monthly_income
                          ? `Rs ${Number(
                              guarantor.monthly_income,
                            ).toLocaleString()}`
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              {/* 🔥 DOCUMENT SECTION PER GUARANTOR */}
              <DocumentSection
                category="guarantor"
                guarantorId={guarantor.id}
                onUpload={({ file, document_type, onProgress, signal }) =>
                  handleUpload({
                    file,
                    document_type,
                    onProgress,
                    signal,
                    guarantor,
                  })
                }
                onDelete={(docId) => handleDelete(docId, guarantor.id)}
                verifyPassword={verifyPassword}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuarantorsTab;
