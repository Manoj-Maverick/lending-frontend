import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const DocumentsTab = ({
  documents,
  onDownload,
  onDelete,
  onUpload,
  onReview,
}) => {
  const [expandedDoc, setExpandedDoc] = useState(null);

  const getStatusColor = (status) => {
    const colors = {
      Verified:
        "bg-success/10 text-success dark:bg-success/20 dark:text-success",
      Pending:
        "bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning",
      Rejected: "bg-error/10 text-error dark:bg-error/20 dark:text-error",
    };
    return colors?.[status] || colors?.["Pending"];
  };

  const getTypeIcon = (type) => {
    const icons = {
      ID: "FileText",
      Address: "MapPin",
      Education: "BookOpen",
      Experience: "Briefcase",
      Bank: "CreditCard",
      Other: "File",
    };
    return icons?.[type] || icons?.["Other"];
  };

  return (
    <div className="space-y-6">
      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents?.map((doc) => (
          <div
            key={doc?.id}
            className="bg-card rounded-lg border border-border p-4 hover:border-accent transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Icon
                  name={getTypeIcon(doc?.type)}
                  size={18}
                  className="text-accent"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {doc?.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Uploaded on {doc?.uploadDate}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(
                  doc?.status,
                )}`}
              >
                {doc?.status}
              </span>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                {doc?.type}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              className="w-full"
              onClick={() => onDownload?.(doc)}
            >
              Download
            </Button>
          </div>
        ))}
      </div>

      {/* Documents List */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border bg-muted/30">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="FileText" size={20} className="text-accent" />
            Document Details
          </h3>
        </div>

        <div className="divide-y divide-border">
          {documents?.map((doc) => (
            <div
              key={doc?.id}
              className="p-4 md:p-6 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() =>
                setExpandedDoc(expandedDoc === doc?.id ? null : doc?.id)
              }
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 hidden sm:flex">
                    <Icon
                      name={getTypeIcon(doc?.type)}
                      size={18}
                      className="text-accent"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {doc?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Uploaded: {doc?.uploadDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(
                      doc?.status,
                    )}`}
                  >
                    {doc?.status}
                  </span>
                  <Icon
                    name={expandedDoc === doc?.id ? "ChevronUp" : "ChevronDown"}
                    size={20}
                    className="text-muted-foreground"
                  />
                </div>
              </div>

              {expandedDoc === doc?.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Document Type
                      </label>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {doc?.type}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Upload Date
                      </label>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {doc?.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                      onClick={() => onDownload?.(doc)}
                    >
                      Download
                    </Button>
                    {doc?.status === "Pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="FileText"
                        iconPosition="left"
                        onClick={() => onReview?.(doc)}
                      >
                        Review
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      className="text-error hover:text-error"
                      onClick={() => onDelete?.(doc)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upload New Document */}
      <div className="bg-card rounded-lg border-2 border-dashed border-border p-8 text-center hover:border-accent/50 transition-colors">
        <Icon
          name="Upload"
          size={32}
          className="mx-auto text-muted-foreground mb-4"
        />
        <h4 className="font-medium text-foreground mb-2">
          Upload New Document
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop or click to upload additional documents
        </p>
        <Button
          variant="outline"
          iconName="Plus"
          iconPosition="left"
          onClick={() => onUpload?.()}
        >
          Upload Document
        </Button>
      </div>
    </div>
  );
};

export default DocumentsTab;
