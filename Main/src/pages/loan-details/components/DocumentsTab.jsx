import React from "react";
import DocumentSection from "pages/borrower-profile/components/DocumentSection";
import { useUploadWithProgress } from "hooks/docs/useUploadWithProgress";
import { useDeleteDocument } from "hooks/docs/useDeleteDoc";
import Button from "components/ui/Button";
import Icon from "components/AppIcon";
import { useUIContext } from "context/UIContext";
import {
  useGenerateLoanAgreement,
  useGenerateLoanStatement,
} from "hooks/loans/useGenerateLoanDocs";

const DocumentsTab = ({ loanId }) => {
  const { uploadDocument } = useUploadWithProgress();
  const { mutateAsync: deleteDoc } = useDeleteDocument();
  const { showToast } = useUIContext();
  const agreementMutation = useGenerateLoanAgreement();
  const statementMutation = useGenerateLoanStatement();

  const handleUpload = async ({ file, document_type, onProgress, signal }) => {
    return uploadDocument({
      file,
      category: "loan",
      document_type,
      loan_id: loanId, // ✅ inject here
      onProgress,
      signal,
    });
  };

  const handleDelete = async (docId) => {
    await deleteDoc({
      id: docId,
      category: "loan",
      loan_id: loanId,
    });
  };

  const verifyPassword = async (password) => {
    return password === "admin123";
  };

  if (!loanId) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Generated Documents
            </h3>
            <p className="text-sm text-muted-foreground">
              Generate fresh agreement and statement PDFs from current loan data.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              loading={agreementMutation.isPending}
              onClick={async () => {
                try {
                  const response = await agreementMutation.mutateAsync(loanId);
                  if (response?.url) {
                    window.open(response.url, "_blank", "noopener,noreferrer");
                    showToast?.("Loan agreement generated", "success");
                  }
                } catch (error) {
                  showToast?.(
                    error?.message || "Failed to generate agreement",
                    "error",
                  );
                }
              }}
            >
              <Icon name="FileSignature" size={16} className="mr-2" />
              Agreement
            </Button>
            <Button
              variant="outline"
              loading={statementMutation.isPending}
              onClick={async () => {
                try {
                  const response = await statementMutation.mutateAsync(loanId);
                  if (response?.url) {
                    const printWindow = window.open(
                      response.url,
                      "_blank",
                      "noopener,noreferrer",
                    );
                    printWindow?.focus();
                    showToast?.("Loan statement generated", "success");
                  }
                } catch (error) {
                  showToast?.(
                    error?.message || "Failed to generate statement",
                    "error",
                  );
                }
              }}
            >
              <Icon name="Printer" size={16} className="mr-2" />
              Statement
            </Button>
          </div>
        </div>
      </div>

      <DocumentSection
        category="loan"
        loanId={loanId}
        onUpload={handleUpload}
        onDelete={handleDelete}
        verifyPassword={verifyPassword}
      />
    </div>
  );
};

export default DocumentsTab;
