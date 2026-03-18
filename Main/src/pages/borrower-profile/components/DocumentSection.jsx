import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Select } from "components/shared";
import { API_BASE_URL } from "api/client";
import {
  useCustomerDocuments,
  useGuarantorDocuments,
  useLoanDocuments,
} from "hooks/docs/useFetchDocs.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const DocumentSection = ({
  category, // "customer" | "guarantor" | "loan"
  borrowerId,
  loanId,
  guarantorId,
  onUpload, // async (category, file, docType) => Promise<void>
  onDelete, // (docId) => Promise<void>
  verifyPassword, // async (password) => Promise<boolean>
}) => {
  const [openSection, setOpenSection] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isReupload, setIsReupload] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadedFilesSummary, setUploadedFilesSummary] = useState([]);

  // ── Data hooks (unchanged) ───────────────────────────────────────
  const { data: borrowerDocuments = [], refetch: refetchCustomer } =
    useCustomerDocuments(category === "customer" ? borrowerId : null);

  const { data: guarantorDocsRaw = [], refetch: refetchGuarantor } =
    useGuarantorDocuments(
      category === "guarantor" && guarantorId ? guarantorId : null,
    );

  const { data: loanDocuments = [], refetch: refetchLoan } = useLoanDocuments(
    category === "loan" && loanId ? loanId : null,
  );

  // ── Document type definitions (unchanged) ────────────────────────
  const customerDocTypes = [
    { value: "PHOTO", label: "Borrower Photo" },
    { value: "ID Proof", label: "ID Proof (Aadhaar / PAN / Voter)" },
    { value: "Address Proof", label: "Address Proof" },
    { value: "Income Proof", label: "Income Proof (Salary Slip / ITR)" },
    { value: "Bank Statement", label: "Bank Statement" },
  ];

  const guarantorDocTypes = [
    { value: "Guarantor Photo", label: "Guarantor Photo" },
    { value: "Guarantor ID Proof", label: "Guarantor ID Proof" },
    { value: "Guarantor Address Proof", label: "Guarantor Address Proof" },
    { value: "Guarantor Income Proof", label: "Guarantor Income Proof" },
  ];

  const loanDocTypes = [
    { value: "Loan Application Form", label: "Loan Application Form" },
    { value: "Loan Agreement", label: "Loan Agreement" },
    { value: "Sanction Letter", label: "Sanction Letter" },
    { value: "Repayment Schedule", label: "Repayment Schedule" },
    { value: "Disbursement Letter", label: "Disbursement Letter" },
    { value: "Other Loan Document", label: "Other Loan Document" },
  ];

  const getDocTypesForCategory = (cat) => {
    if (cat === "customer") return customerDocTypes;
    if (cat === "guarantor") return guarantorDocTypes;
    if (cat === "loan") return loanDocTypes;
    return [];
  };

  const getMissingTypes = (cat) => {
    let uploadedTypes = new Set();
    if (cat === "customer") {
      uploadedTypes = new Set(
        borrowerDocuments.map((d) => d.type?.toLowerCase().trim()),
      );
    } else if (cat === "guarantor") {
      uploadedTypes = new Set(
        guarantorDocsRaw.map((d) => d.type?.toLowerCase()),
      );
    } else if (cat === "loan") {
      uploadedTypes = new Set(loanDocuments.map((d) => d.type?.toLowerCase()));
    }
    return getDocTypesForCategory(cat).filter(
      (t) => !uploadedTypes.has(t.value.toLowerCase()),
    );
  };

  // ── File handling (addFiles, removeFile, startUpload) ─────────────
  // (keeping your original logic – omitted here for brevity)
  const addFiles = (filesList) => {
    if (!selectedFileType) {
      alert("Please select a document type first.");
      return;
    }

    const missing = getMissingTypes(category);
    if (!isReupload && !missing.some((t) => t.value === selectedFileType)) {
      alert("This document type is already uploaded");
      return;
    }

    if (selectedFiles.some((f) => f.type === selectedFileType)) {
      alert(
        "You cannot upload multiple files for the same type in one session.",
      );
      return;
    }

    const newFiles = Array.from(filesList).map((file) => {
      const errors = [];
      if (file.size > MAX_FILE_SIZE) errors.push("File too large (max 10 MB)");
      if (!/\.(pdf|jpg|jpeg|png)$/i.test(file.name)) {
        errors.push("Only PDF, JPG, JPEG, PNG allowed");
      }

      return {
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        file: new File([file], file.name, { type: file.type }),
        size: file.size,
        type: selectedFileType,
        category,
        status: errors.length > 0 ? "error" : "pending",
        error: errors.length > 0 ? errors.join(" • ") : null,
      };
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const startUpload = async () => {
    const pending = selectedFiles.filter((f) => f.status === "pending");
    if (pending.length === 0) {
      alert("No valid files ready to upload.");
      return;
    }

    for (const fileObj of pending) {
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id ? { ...f, status: "uploading" } : f,
        ),
      );

      try {
        if (!fileObj.file || fileObj.file.size === 0) {
          throw new Error("Invalid file (mobile issue)");
        }

        await onUpload({
          category: fileObj.category,
          file: fileObj.file,
          document_type: fileObj.type,
        });

        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id ? { ...f, status: "completed" } : f,
          ),
        );

        setUploadedFilesSummary((prev) => [
          ...prev,
          {
            name: fileObj.name,
            category: fileObj.category,
            type: fileObj.type,
            size: fileObj.size,
            timestamp: new Date().toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
          },
        ]);
      } catch (err) {
        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id
              ? { ...f, status: "error", error: err.message || "Upload failed" }
              : f,
          ),
        );
      }
    }

    // Refetch after all uploads
    if (category === "customer") refetchCustomer();
    if (category === "guarantor") refetchGuarantor();
    if (category === "loan") refetchLoan();

    setIsReupload(false);
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setSelectedFileType("");
    setSelectedFiles([]);
    setIsReupload(false);
  };

  const clearSummary = () => setUploadedFilesSummary([]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(1)} ${units[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDocumentIcon = (type = "") => {
    const map = {
      PHOTO: "Image",
      "ID Proof": "CreditCard",
      "Address Proof": "MapPin",
      "Income Proof": "FileText",
      "Bank Statement": "Building2",
      "Guarantor Photo": "Image",
      "Guarantor ID Proof": "CreditCard",
      "Guarantor Address Proof": "MapPin",
      "Guarantor Income Proof": "FileText",
      "Loan Application Form": "FileSignature",
      "Loan Agreement": "FileSignature",
      "Sanction Letter": "FileCheck",
      "Repayment Schedule": "Calendar",
      "Disbursement Letter": "Send",
      "Other Loan Document": "File",
    };
    return map[type] || "FileText";
  };

  const getCategoryColor = (type = "") => {
    const lower = type.toLowerCase();
    if (lower.includes("photo"))
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";
    if (
      lower.includes("id") ||
      lower.includes("pan") ||
      lower.includes("aadhaar")
    )
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
    if (lower.includes("address"))
      return "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400";
    if (
      lower.includes("income") ||
      lower.includes("itr") ||
      lower.includes("salary")
    )
      return "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400";
    if (lower.includes("bank"))
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";
    if (lower.includes("agreement"))
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400";
    if (lower.includes("sanction"))
      return "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400";
    if (lower.includes("disbursement"))
      return "bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  const isImage = (doc) =>
    doc?.name?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    doc?.type?.toLowerCase().includes("photo");

  const isPDF = (doc) => {
    const name = doc?.name?.toLowerCase() || "";
    const url = doc?.url?.toLowerCase() || "";

    return name.endsWith(".pdf") || url.endsWith(".pdf");
  };

  // ── Action handlers ──────────────────────────────────────────────
  const handlePreview = (doc) => {
    if (doc?.url) {
      setPreviewDoc(doc);
    }
  };

  const handleDownload = (doc) => {
    if (!doc?.url) return;
    const link = document.createElement("a");
    link.href = `${API_BASE_URL}${doc.url}`;
    link.download = doc.name || "document";
    link.click();
  };

  const handleReupload = (doc) => {
    setSelectedFileType(doc.type);
    setIsReupload(true);
    setTimeout(() => setShowUploadModal(true), 0);
  };

  const handleDeleteAttempt = (docId) => {
    setDeleteConfirm({ docId });
    setDeletePassword("");
    setPasswordError("");
  };

  const confirmDelete = async () => {
    if (!deleteConfirm?.docId) return;
    const valid = await verifyPassword(deletePassword);
    if (!valid) {
      setPasswordError("Incorrect password");
      return;
    }
    await onDelete(deleteConfirm.docId);
    setDeleteConfirm(null);
    setDeletePassword("");
    setPasswordError("");
    if (category === "customer") refetchCustomer();
    if (category === "guarantor") refetchGuarantor();
    if (category === "loan") refetchLoan();
  };

  const currentDocs =
    category === "customer"
      ? borrowerDocuments
      : category === "loan"
        ? loanDocuments
        : guarantorDocsRaw;

  const sectionTitle =
    category === "customer"
      ? "Customer Documents"
      : category === "guarantor"
        ? "Guarantor Documents"
        : "Loan Documents";

  const sectionIcon =
    category === "customer"
      ? "User"
      : category === "guarantor"
        ? "Users"
        : "FileText";

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-12">
      {/* Your existing upload progress + summary blocks remain here */}
      <AnimatePresence mode="popLayout">
        {selectedFiles.some((f) => f.status === "uploading") && (
          <div className="space-y-3">
            {selectedFiles
              .filter((f) => f.status === "uploading")
              .map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200"
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      name="Loader2"
                      className="animate-spin text-blue-600"
                      size={24}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {file.type} • {formatFileSize(file.size)}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      Uploading...
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </AnimatePresence>

      {/* Upload Complete Summary */}
      <AnimatePresence>
        {uploadedFilesSummary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Icon
                  name="CheckCircle2"
                  size={28}
                  className="text-green-600 dark:text-green-400"
                />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  Upload Complete
                </h3>
              </div>
              <span className="text-sm text-green-700 dark:text-green-400">
                {uploadedFilesSummary.length} file
                {uploadedFilesSummary.length !== 1 ? "s" : ""} processed
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 mb-6">
              {uploadedFilesSummary.map((file, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800/70 rounded-lg p-4 border border-green-100 dark:border-green-900/50"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {file.category} → {file.type}
                      </div>
                    </div>
                    <div className="text-xs font-medium text-green-700 dark:text-green-400 whitespace-nowrap">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {file.timestamp}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button variant="default" size="sm" onClick={clearSummary}>
                Save & Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div
          className="px-5 py-4 flex items-center justify-between cursor-pointer 
    bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/40 hover:to-muted/20 transition-colors"
          onClick={() => setOpenSection(!openSection)}
        >
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name={sectionIcon} size={20} className="text-primary" />
            </div>

            <div>
              <h3 className="font-semibold text-lg">{sectionTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {currentDocs.length} document
                {currentDocs.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setShowUploadModal(true);
              }}
            >
              <Icon name="Upload" size={16} className="mr-2" />
              Upload
            </Button>

            <motion.div
              animate={{ rotate: openSection ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Icon name="ChevronDown" size={20} />
            </motion.div>
          </div>
        </div>

        {/* BODY */}
        <AnimatePresence>
          {openSection && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-5 pt-2">
                {currentDocs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-muted/30 border border-border rounded-lg p-4 
                  hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => handlePreview(doc)}
                      >
                        <div className="flex items-start gap-3">
                          {/* ICON */}
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon
                              name={getDocumentIcon(doc.type)}
                              size={24}
                              className="text-primary"
                            />
                          </div>

                          {/* CONTENT */}
                          <div className="flex-1 min-w-0">
                            {/* TITLE */}
                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {doc.name}
                            </p>

                            {/* TYPE BADGE (MOVED BELOW TITLE) */}
                            <div className="flex items-center justify-between mt-1 gap-2">
                              <p className="text-xs text-muted-foreground truncate">
                                {formatFileSize(doc.size)}
                              </p>

                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0 ${getCategoryColor(doc.type)}`}
                              >
                                {doc.type}
                              </span>
                            </div>

                            {/* DATE */}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                              <Icon name="Calendar" size={12} />
                              {formatDate(doc.uploaded_at)}
                            </div>

                            {/* ACTIONS */}
                            <div
                              className="flex items-center gap-2 mt-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 min-w-0"
                                onClick={() => handleDownload(doc)}
                              >
                                <Icon
                                  name="Download"
                                  size={14}
                                  className="mr-1"
                                />
                                Download
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 min-w-0"
                                onClick={() => handleReupload(doc)}
                              >
                                <Icon
                                  name="Upload"
                                  size={14}
                                  className="mr-1"
                                />
                                Reupload
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteAttempt(doc.id)}
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center text-muted-foreground">
                    <Icon
                      name="FileX"
                      size={48}
                      className="mx-auto mb-4 opacity-50"
                    />
                    <p className="text-lg">No documents uploaded yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 20, opacity: 0 }}
              className="bg-card rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Upload {sectionTitle}</h3>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <Icon name="X" size={24} />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Document Type
                  </label>
                  <Select
                    options={
                      isReupload
                        ? getDocTypesForCategory(category) // 🔥 allow all
                        : getMissingTypes(category)
                    }
                    value={selectedFileType}
                    onChange={setSelectedFileType}
                    placeholder="Select document type..."
                    disabled={isReupload}
                  />
                </div>
                {isReupload && (
                  <div className="text-sm text-warning">
                    Replacing: <strong>{selectedFileType}</strong>
                  </div>
                )}

                {selectedFileType && (
                  <>
                    <div
                      className="border-2 border-dashed rounded-xl p-10 text-center transition-all hover:border-primary hover:bg-primary/5 cursor-pointer"
                      onDrop={(e) => {
                        e.preventDefault();
                        addFiles(e.dataTransfer.files);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Icon
                        name="UploadCloud"
                        size={56}
                        className="mx-auto text-muted-foreground mb-4"
                      />
                      <p className="font-semibold text-lg mb-2">
                        Click or drag files here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF, JPG, PNG • max 10 MB • one file per type
                      </p>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h4 className="font-medium text-lg">Selected Files</h4>
                        {selectedFiles.map((file) => (
                          <div
                            key={file.id}
                            className={`p-4 rounded-lg border flex items-center justify-between gap-4 ${
                              file.status === "completed"
                                ? "bg-green-50 border-green-200"
                                : file.status === "uploading"
                                  ? "bg-blue-50 border-blue-200"
                                  : file.status === "error"
                                    ? "bg-red-50 border-red-200"
                                    : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Icon
                                name={getDocumentIcon(file.type)}
                                size={28}
                                className="text-primary/70 flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {file.name}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {file.type} • {formatFileSize(file.size)}
                                </div>
                                {file.error && (
                                  <div className="text-xs text-red-600 mt-1">
                                    {file.error}
                                  </div>
                                )}
                              </div>
                            </div>

                            {file.status === "pending" && (
                              <div className="text-sm text-gray-500">Ready</div>
                            )}
                            {file.status === "uploading" && (
                              <div className="text-sm font-medium text-blue-600">
                                Uploading...
                              </div>
                            )}
                            {file.status === "completed" && (
                              <div className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                                <Icon name="CheckCircle" size={16} /> Done
                              </div>
                            )}
                            {file.status === "error" && (
                              <div className="text-sm font-medium text-red-600">
                                Failed
                              </div>
                            )}

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeFile(file.id)}
                            >
                              <Icon name="X" size={18} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-4 pt-6 border-t mt-6">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>

                  {selectedFiles.length > 0 &&
                    selectedFiles.some((f) => f.status === "pending") && (
                      <Button className="flex-1" onClick={startUpload}>
                        Start Upload
                      </Button>
                    )}

                  {selectedFiles.length === 0 && selectedFileType && (
                    <Button
                      className="flex-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select File
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="bg-card rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold truncate max-w-[60vw]">
                    {previewDoc.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {previewDoc.type} • {formatFileSize(previewDoc.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewDoc(null)}
                >
                  <Icon name="X" size={22} />
                </Button>
              </div>

              <div className="p-6 overflow-auto max-h-[calc(90vh-140px)]">
                {isImage(previewDoc) ? (
                  <img
                    src={`${API_BASE_URL}${previewDoc.url}`}
                    alt={previewDoc.name}
                    className="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-xl object-contain"
                  />
                ) : isPDF(previewDoc) ? (
                  <iframe
                    src={`${API_BASE_URL}${encodeURI(previewDoc.url)}`}
                    className="w-full h-[70vh] rounded-lg border shadow-inner"
                    title={previewDoc.name}
                  />
                ) : (
                  <div className="text-center py-24">
                    <Icon
                      name="File"
                      size={72}
                      className="mx-auto text-muted-foreground mb-6"
                    />
                    <p className="text-xl font-medium mb-4">
                      No preview available
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(previewDoc)}
                    >
                      Download to View
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-destructive mb-5">
                <Icon name="AlertTriangle" size={28} />
                <h3 className="text-xl font-semibold">Delete Document?</h3>
              </div>

              <p className="text-muted-foreground mb-6">
                This action is permanent. Enter your password to confirm.
              </p>

              <input
                type="password"
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-destructive/40"
                autoFocus
              />

              {passwordError && (
                <p className="text-destructive text-sm mb-5">{passwordError}</p>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={confirmDelete}
                  disabled={!deletePassword.trim()}
                >
                  Delete Permanently
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentSection;
