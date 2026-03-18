import React from "react";
import DocumentSection from "pages/borrower-profile/components/DocumentSection";
import { useUploadDocument } from "hooks/docs/useUploadDoc";
import { useDeleteDocument } from "hooks/docs/useDeleteDoc";

const DocumentsTab = ({ loanId }) => {
  console.log(loanId);
  const { mutateAsync: uploadDoc } = useUploadDocument();
  const { mutateAsync: deleteDoc } = useDeleteDocument();

  const handleUpload = async ({ category, file, document_type }) => {
    await uploadDoc({
      category,
      loan_id: loanId, // ✅ inject here
      document_type,
      file,
    });
  };

  const handleDelete = async (docId) => {
    await deleteDoc({
      id: docId,
      category: "loan",
    });
  };

  const verifyPassword = async (password) => {
    // replace later with API
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
