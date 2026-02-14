import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const DocumentsTab = ({ documents, onUpload, onDownload, onDelete }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);

  const getDocumentIcon = (type) => {
    const iconMap = {
      "ID Proof": "CreditCard",
      "Address Proof": "MapPin",
      "Income Proof": "FileText",
      Photo: "Image",
      "Bank Statement": "Building2",
      Other: "File",
    };
    return iconMap?.[type] || "File";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024)?.toFixed(1) + " KB";
    return (bytes / (1024 * 1024))?.toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground">
            Documents
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage client documents and files
          </p>
        </div>
        <Button
          variant="default"
          iconName="Upload"
          iconPosition="left"
          onClick={onUpload}
          className="w-full sm:w-auto"
        >
          Upload Document
        </Button>
      </div>
      {documents?.length === 0 ? (
        <div className="bg-card rounded-lg p-8 md:p-12 text-center shadow-elevation-sm">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <Icon name="FileText" size={32} className="text-muted-foreground" />
          </div>
          <h4 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            No Documents Uploaded
          </h4>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            Upload client documents to maintain complete records
          </p>
          <Button
            variant="outline"
            iconName="Upload"
            iconPosition="left"
            onClick={onUpload}
          >
            Upload First Document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {documents?.map((doc) => (
            <div
              key={doc?.id}
              className="bg-card rounded-lg p-4 md:p-6 shadow-elevation-sm hover:shadow-elevation-md transition-shadow duration-250 cursor-pointer"
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon
                    name={getDocumentIcon(doc?.type)}
                    size={24}
                    color="var(--color-primary)"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-base md:text-lg font-semibold text-foreground truncate">
                    {doc?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {doc?.type}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs md:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      {doc?.uploadDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="HardDrive" size={14} />
                      {formatFileSize(doc?.size)}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onDownload(doc?.id);
                      }}
                      className="flex-1"
                    >
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onDelete(doc?.id);
                      }}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Document Preview Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="bg-card rounded-lg shadow-elevation-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e?.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground">
                  {selectedDoc?.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDoc?.type} • {formatFileSize(selectedDoc?.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDoc(null)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-muted/30 rounded-lg p-8 md:p-12 text-center">
                <Icon
                  name={getDocumentIcon(selectedDoc?.type)}
                  size={64}
                  className="mx-auto text-muted-foreground mb-4"
                />
                <p className="text-sm md:text-base text-muted-foreground">
                  Document preview not available
                </p>
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => onDownload(selectedDoc?.id)}
                  className="mt-4"
                >
                  Download to View
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
