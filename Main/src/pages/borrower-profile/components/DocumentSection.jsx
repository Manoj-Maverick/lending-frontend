import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { toApiAssetUrl } from "utils/helper.js";
import {
  useCustomerDocuments,
  useGuarantorDocuments,
  useLoanDocuments,
  useStaffDocuments,
} from "hooks/docs/useFetchDocs.js";
import { useUIContext } from "context/UIContext";
import { useToast } from "context/ToastContext";
import { compressAnyFile } from "utils/helper.js";
import { UploadModal } from "./UploadModal";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const DocumentSection = ({
  category, // "customer" | "guarantor" | "loan"
  borrowerId,
  loanId,
  guarantorId,
  onUpload, // Now expected to accept: { file, document_type, onProgress }
  onDelete,
  verifyPassword,
}) => {
  const { setIsSidebarCollapsed } = useUIContext();
  const { showToast } = useToast();

  const [openSection, setOpenSection] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReupload, setIsReupload] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // now also has: progress, abortController
  const [uploadedFilesSummary, setUploadedFilesSummary] = useState([]);

  const fileInputRef = useRef(null);

  // Data hooks
  const { data: borrowerDocuments = [], refetch: refetchCustomer } =
    useCustomerDocuments(category === "customer" ? borrowerId : null);

  const { data: guarantorDocs = [], refetch: refetchGuarantor } =
    useGuarantorDocuments(
      category === "guarantor" && guarantorId ? guarantorId : null,
    );

  const { data: loanDocuments = [], refetch: refetchLoan } = useLoanDocuments(
    category === "loan" && loanId ? loanId : null,
  );
  const { data: staffDocs = [], refetch: refetchStaff } = useStaffDocuments(
    category === "staff" && borrowerId ? borrowerId : null,
  );

  const currentDocs =
    category === "customer"
      ? borrowerDocuments
      : category === "loan"
        ? loanDocuments
        : category === "staff"
          ? staffDocs
          : guarantorDocs;

  // ── Document Types & Helpers ───────────────────────────────────────
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
  const staffDocTypes = [
    { value: "PHOTO", label: "Staff Photo" },
    { value: "AADHAAR", label: "Aadhaar Document" },
    { value: "PAN", label: "PAN Document" },
    { value: "ADDRESS_PROOF", label: "Address Proof" },
    { value: "BANK_PROOF", label: "Bank Proof / Passbook" },
    { value: "EDUCATION_PROOF", label: "Education Proof" },
  ];

  const getDocTypes = () =>
    category === "customer"
      ? customerDocTypes
      : category === "guarantor"
        ? guarantorDocTypes
        : category === "loan"
          ? loanDocTypes
          : category === "staff"
            ? staffDocTypes
            : [];

  const getMissingTypes = () => {
    const uploaded = new Set(
      currentDocs.map((d) => d.type?.toLowerCase().trim()),
    );
    return getDocTypes().filter(
      (t) => !uploaded.has(t.value.toLowerCase().trim()),
    );
  };

  // ── File Handlers ──────────────────────────────────────────────────
  const addFiles = (filesList) => {
    if (!selectedFileType) {
      alert("Please select a document type first.");
      return;
    }

    const missing = getMissingTypes();
    if (!isReupload && !missing.some((t) => t.value === selectedFileType)) {
      alert("This document type is already uploaded.");
      return;
    }

    if (selectedFiles.some((f) => f.type === selectedFileType)) {
      alert("Only one file per type allowed per session.");
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
        file,
        size: file.size,
        type: selectedFileType,
        category,
        status: errors.length ? "error" : "compressing", // Start with compressing state
        error: errors.length ? errors.join(" • ") : null,
        progress: 0,
        abortController: new AbortController(),
      };
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Defer compression to next tick to prevent UI blocking
    // This allows React to batch updates and the modal to finish rendering
    newFiles.forEach((fileObj) => {
      Promise.resolve().then(async () => {
        // Yield to browser
        await new Promise((r) => setTimeout(r, 0));

        try {
          if (fileObj.status === "error") return; // Skip if validation error

          const compressed = await compressAnyFile(fileObj.file);

          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? { ...f, file: compressed, status: "pending" }
                : f,
            ),
          );
        } catch (err) {
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    status: "error",
                    error: `Compression failed: ${err.message}`,
                  }
                : f,
            ),
          );
        }
      });
    });
  };

  const removeFile = (id) => {
    setSelectedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.abortController) file.abortController.abort();
      return prev.filter((f) => f.id !== id);
    });
  };

  const startUpload = async () => {
    const toUpload = selectedFiles.filter((f) => f.status === "pending");
    if (toUpload.length === 0) return;

    // Show upload start toast
    showToast(`Uploading ${toUpload.length} file${toUpload.length !== 1 ? "s" : ""}...`, "info");

    let successCount = 0;
    let errorCount = 0;

    for (const fileObj of toUpload) {
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id ? { ...f, status: "uploading", progress: 0 } : f,
        ),
      );

      try {
        // File is already compressed in addFiles, use it directly
        await onUpload({
          file: fileObj.file,
          document_type: fileObj.type,
          onProgress: (percent) => {
            setSelectedFiles((prev) =>
              prev.map((f) =>
                f.id === fileObj.id ? { ...f, progress: percent } : f,
              ),
            );
          },
          signal: fileObj.abortController.signal,
        });

        // Simulate saving phase with a slight delay (shows user it's being processed)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id
              ? { ...f, status: "completed", progress: 100 }
              : f,
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

        // Show success for this file
        showToast(`✓ ${fileObj.name} uploaded successfully`, "success");
        successCount++;
      } catch (err) {
        if (err.name === "AbortError") {
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id ? { ...f, status: "cancelled" } : f,
            ),
          );
          showToast(`✕ ${fileObj.name} upload cancelled`, "warning");
        } else {
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    status: "error",
                    error: err.message || "Upload failed",
                    progress: 0,
                  }
                : f,
            ),
          );
          showToast(`✕ ${fileObj.name} upload failed: ${err.message}`, "error");
          errorCount++;
        }
      }
    }

    // Refetch after batch
    if (category === "customer") refetchCustomer();
    if (category === "guarantor") refetchGuarantor();
    if (category === "loan") refetchLoan();
    if (category === "staff") refetchStaff();

    // Show summary toast
    if (errorCount === 0 && successCount > 0) {
      showToast(`All documents uploaded successfully!`, "success");
    } else if (successCount > 0 && errorCount > 0) {
      showToast(
        `${successCount} uploaded, ${errorCount} failed`,
        "warning",
      );
    }
  };

  const closeModal = () => {
    // Abort all ongoing uploads
    selectedFiles.forEach((f) => f.abortController?.abort());
    setShowUploadModal(false);
    setSelectedFileType("");
    setSelectedFiles([]);
    setIsReupload(false);
  };

  const clearSummary = () => setUploadedFilesSummary([]);

  // Formatters (same as before)
  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes,
      i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(1)} ${units[i]}`;
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

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
    const t = type.toLowerCase();
    if (t.includes("photo"))
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";
    if (t.includes("id") || t.includes("pan") || t.includes("aadhaar"))
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
    if (t.includes("address"))
      return "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400";
    if (t.includes("income") || t.includes("itr") || t.includes("salary"))
      return "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400";
    if (t.includes("bank"))
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";
    if (t.includes("agreement"))
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400";
    if (t.includes("sanction"))
      return "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400";
    if (t.includes("disbursement"))
      return "bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  const isImageFile = (doc) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(doc?.name || "") ||
    doc?.type?.toLowerCase().includes("photo");
  const isPDFFile = (doc) =>
    (doc?.name || "").toLowerCase().endsWith(".pdf") ||
    (doc?.url || "").toLowerCase().endsWith(".pdf");

  // Action handlers (same as before, omitted for brevity)

  const handlePreview = (doc) => {
    setPreviewDoc({ ...doc, url: toApiAssetUrl(doc.url) });
    setIsSidebarCollapsed(true);
  };

  const handleDownload = async (doc) => {
    try {
      const response = await fetch(toApiAssetUrl(doc.url));
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = doc.name || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };
  const handleReupload = (doc) => {
    setSelectedFileType(doc.type);
    setIsReupload(true);
    setShowUploadModal(true);
    showToast(`Ready to replace "${doc.name}"`, "info");
  };

  const handleDeleteAttempt = (docId) => {
    setDeleteConfirm({ docId });
    setDeletePassword("");
    setPasswordError("");
  };

  const confirmDelete = async () => {
    if (!deleteConfirm?.docId) return;

    try {
      setIsDeleting(true);
      const isValid = await verifyPassword(deletePassword);
      if (!isValid) {
        setPasswordError("Incorrect password");
        showToast("Incorrect password", "error");
        setIsDeleting(false);
        return;
      }

      // Show deletion in progress
      showToast("Deleting document...", "info");

      // Password verified, proceed with deletion
      await onDelete(deleteConfirm.docId);

      // Show success
      showToast("Document deleted successfully", "success");

      setDeleteConfirm(null);
      setDeletePassword("");
      setPasswordError("");

      // Refetch data
      if (category === "customer") refetchCustomer();
      if (category === "guarantor") refetchGuarantor();
      if (category === "loan") refetchLoan();
      if (category === "staff") refetchStaff();
    } catch (err) {
      const errorMsg = err.message || "Deletion failed";
      setPasswordError(errorMsg);
      showToast(`Deletion failed: ${errorMsg}`, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── RENDER ─────────────────────────────────────────────────────────
  const sectionTitle =
    category === "customer"
      ? "Customer Documents"
      : category === "guarantor"
        ? "Guarantor Documents"
        : category === "staff"
          ? "Staff Documents"
          : "Loan Documents";

  const sectionIcon =
    category === "customer"
      ? "User"
      : category === "guarantor"
        ? "Users"
        : category === "staff"
          ? "FolderOpen"
          : "FileText";

  return (
    <div className="space-y-6 pb-12">
      {/* Summary & in-progress cards (same as before) */}
      {/* ... omitted for brevity ... */}
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
                      Uploading…
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </AnimatePresence>

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
              {uploadedFilesSummary.map((file, i) => (
                <div
                  key={i}
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

      {/* Main Document Card */}
      <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/40 hover:to-muted/20 transition-colors"
          onClick={() => setOpenSection(!openSection)}
        >
          <div className="flex items-center gap-3">
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

        {/* Content */}
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
                        className="bg-muted/30 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => handlePreview(doc)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon
                              name={getDocumentIcon(doc.type)}
                              size={24}
                              className="text-primary"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {doc.name}
                            </p>

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

                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                              <Icon name="Calendar" size={12} />
                              {formatDate(doc.uploaded_at)}
                            </div>

                            <div
                              className="flex items-center gap-2 mt-4 flex-wrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="outline"
                                size="sm"
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
                                onClick={() => handleReupload(doc)}
                              >
                                <Icon
                                  name="Upload"
                                  size={14}
                                  className="mr-1"
                                />
                                Replace
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteAttempt(doc.id)}
                                title="Delete document"
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
      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          // Defer value reset to next tick to prevent synchronous DOM refresh
          setTimeout(() => {
            e.target.value = "";
          }, 0);
        }}
      />

      {/* ── Upload Modal with Progress (Memoized for Performance) ──────────────────── */}
      <UploadModal
        showUploadModal={showUploadModal}
        closeModal={closeModal}
        sectionTitle={sectionTitle}
        selectedFileType={selectedFileType}
        setSelectedFileType={setSelectedFileType}
        isReupload={isReupload}
        getMissingTypes={getMissingTypes}
        getDocTypes={getDocTypes}
        selectedFiles={selectedFiles}
        removeFile={removeFile}
        addFiles={addFiles}
        getDocumentIcon={getDocumentIcon}
        formatFileSize={formatFileSize}
        startUpload={startUpload}
        fileInputRef={fileInputRef}
      />

      {/* ── Preview Modal ─────────────────────────────────────────────── */}
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
                {isImageFile(previewDoc) ? (
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.name}
                    className="max-w-full max-h-[70vh] mx-auto rounded-lg shadow-xl object-contain"
                  />
                ) : isPDFFile(previewDoc) ? (
                  <iframe
                    src={previewDoc.url}
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

      {/* ── Delete Confirmation ───────────────────────────────────────── */}
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
                This action cannot be undone. Enter your password to confirm.
              </p>

              <input
                type="password"
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value);
                  setPasswordError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && deletePassword.trim()) {
                    confirmDelete();
                  }
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
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={confirmDelete}
                  disabled={!deletePassword.trim() || isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Permanently"
                  )}
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
