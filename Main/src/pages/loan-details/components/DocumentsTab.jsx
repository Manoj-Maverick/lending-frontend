import React from "react";
import DocumentSection from "pages/borrower-profile/components/DocumentSection";
import { useUploadWithProgress } from "hooks/docs/useUploadWithProgress";
import { useDeleteDocument } from "hooks/docs/useDeleteDoc";

const DocumentsTab = ({ loanId }) => {
  const { uploadDocument } = useUploadWithProgress();
  const { mutateAsync: deleteDoc } = useDeleteDocument();

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
    <DocumentSection
      category="loan"
      loanId={loanId}
      onUpload={handleUpload}
      onDelete={handleDelete}
      verifyPassword={verifyPassword}
    />
  );
};

export default DocumentsTab;
