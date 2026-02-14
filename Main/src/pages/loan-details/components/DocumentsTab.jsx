import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const DocumentsTab = ({ loanId }) => {
  const mockDocuments = [
    {
      id: "DOC-001",
      name: "Loan Agreement",
      type: "PDF",
      size: "2.4 MB",
      uploadedDate: "2025-08-10",
      uploadedBy: "Sunil Verma",
      category: "Agreement",
    },
    {
      id: "DOC-002",
      name: "Property Documents",
      type: "PDF",
      size: "5.1 MB",
      uploadedDate: "2025-08-10",
      uploadedBy: "Rajesh Kumar",
      category: "Collateral",
    },
    {
      id: "DOC-003",
      name: "Identity Proof - Aadhaar",
      type: "PDF",
      size: "1.2 MB",
      uploadedDate: "2025-08-08",
      uploadedBy: "Rajesh Kumar",
      category: "Identity",
    },
    {
      id: "DOC-004",
      name: "Income Proof - Bank Statement",
      type: "PDF",
      size: "3.8 MB",
      uploadedDate: "2025-08-08",
      uploadedBy: "Rajesh Kumar",
      category: "Financial",
    },
    {
      id: "DOC-005",
      name: "Collateral Valuation Report",
      type: "PDF",
      size: "1.9 MB",
      uploadedDate: "2025-08-09",
      uploadedBy: "Anjali Desai",
      category: "Collateral",
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDocumentIcon = (type) => {
    const icons = {
      PDF: "FileText",
      DOC: "FileText",
      DOCX: "FileText",
      JPG: "Image",
      PNG: "Image",
      JPEG: "Image",
    };
    return icons?.[type] || "File";
  };

  const getCategoryColor = (category) => {
    const colors = {
      Agreement:
        "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
      Collateral:
        "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
      Identity:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
      Financial:
        "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
    };
    return colors?.[category] || colors?.Agreement;
  };

  const handlePreview = (documentId) => {
    console.log("Previewing document:", documentId);
  };

  const handleDownload = (documentId) => {
    console.log("Downloading document:", documentId);
  };

  const handleUpload = () => {
    console.log("Upload new document");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Documents</h3>
        <Button onClick={handleUpload}>
          <Icon name="Upload" size={16} className="mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockDocuments?.map((document) => (
          <div
            key={document?.id}
            className="bg-muted/30 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon
                  name={getDocumentIcon(document?.type)}
                  size={24}
                  className="text-primary"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {document?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {document?.type} • {document?.size}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${getCategoryColor(document?.category)}`}
                  >
                    {document?.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" size={12} />
                    {formatDate(document?.uploadedDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="User" size={12} />
                    {document?.uploadedBy}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(document?.id)}
                    className="flex-1"
                  >
                    <Icon name="Eye" size={14} className="mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(document?.id)}
                    className="flex-1"
                  >
                    <Icon name="Download" size={14} className="mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsTab;
