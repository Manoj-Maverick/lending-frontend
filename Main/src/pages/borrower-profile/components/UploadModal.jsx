import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Select } from "components/shared";

const UploadModalContent = ({
  showUploadModal,
  closeModal,
  sectionTitle,
  selectedFileType,
  setSelectedFileType,
  isReupload,
  getMissingTypes,
  getDocTypes,
  selectedFiles,
  removeFile,
  addFiles,
  getDocumentIcon,
  formatFileSize,
  startUpload,
  fileInputRef,
}) => {
  return (
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
                  options={isReupload ? getDocTypes() : getMissingTypes()}
                  value={selectedFileType}
                  onChange={setSelectedFileType}
                  placeholder="Select document type..."
                  disabled={
                    isReupload ||
                    selectedFiles.some((f) => f.status === "uploading")
                  }
                />
              </div>

              {isReupload && selectedFileType && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Replacing: <strong>{selectedFileType}</strong>
                </p>
              )}

              {selectedFileType && (
                <>
                  <div
                    className="border-2 border-dashed rounded-xl p-10 text-center hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
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
                      Click or drag file here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF, JPG, PNG • max 10 MB
                    </p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-4 mt-6">
                      <h4 className="font-medium text-lg">Files</h4>
                      {selectedFiles.map((file) => (
                        <div
                          key={file.id}
                          className={`p-4 rounded-lg border ${
                            file.status === "completed"
                              ? "bg-green-50 border-green-200"
                              : file.status === "uploading"
                                ? "bg-blue-50 border-blue-200"
                                : file.status === "error"
                                  ? "bg-red-50 border-red-200"
                                  : file.status === "cancelled"
                                    ? "bg-gray-100 border-gray-300"
                                    : file.status === "compressing"
                                      ? "bg-yellow-50 border-yellow-200"
                                      : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Icon
                                name={getDocumentIcon(file.type)}
                                size={28}
                                className="text-primary/70"
                              />
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {file.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {file.type} • {formatFileSize(file.size)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {file.status === "pending" && (
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Ready to upload
                                </span>
                              )}
                              {file.status === "compressing" && (
                                <div className="flex items-center gap-2">
                                  <Icon
                                    name="Loader2"
                                    size={16}
                                    className="animate-spin text-yellow-600"
                                  />
                                  <span className="text-sm text-yellow-600">
                                    Compressing...
                                  </span>
                                </div>
                              )}
                              {file.status === "uploading" && (
                                <div className="flex items-center gap-2">
                                  <Icon
                                    name="Loader2"
                                    size={16}
                                    className="animate-spin text-blue-600"
                                  />
                                  <div className="w-28 text-right">
                                    <div className="text-sm font-medium text-blue-600">
                                      {Math.round(file.progress)}%
                                    </div>
                                    <div className="text-xs text-blue-500">
                                      Uploading...
                                    </div>
                                  </div>
                                </div>
                              )}
                              {file.status === "completed" && (
                                <div className="flex items-center gap-2">
                                  <Icon
                                    name="CheckCircle2"
                                    size={16}
                                    className="text-green-600"
                                  />
                                  <span className="text-sm font-medium text-green-600">
                                    Saved
                                  </span>
                                </div>
                              )}
                              {file.status === "error" && (
                                <div className="flex items-center gap-2">
                                  <Icon
                                    name="X"
                                    size={16}
                                    className="text-red-600"
                                  />
                                  <span className="text-sm font-medium text-red-600">
                                    Failed
                                  </span>
                                </div>
                              )}
                              {file.status === "cancelled" && (
                                <span className="text-sm text-gray-600">
                                  Cancelled
                                </span>
                              )}

                              {(file.status === "pending" ||
                                file.status === "uploading" ||
                                file.status === "compressing") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFile(file.id)}
                                  disabled={
                                    file.status === "uploading" &&
                                    file.progress > 0 &&
                                    file.progress < 100
                                  }
                                >
                                  <Icon name="X" size={18} />
                                </Button>
                              )}
                            </div>
                          </div>

                          {file.status === "uploading" && (
                            <div className="mt-3 space-y-1.5">
                              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${Math.round(file.progress)}%`,
                                  }}
                                  transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>
                                  {formatFileSize(
                                    (file.size * Math.round(file.progress)) /
                                      100,
                                  )}
                                </span>
                                <span>{formatFileSize(file.size)}</span>
                              </div>
                            </div>
                          )}

                          {file.status === "completed" && (
                            <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900/30">
                              <p className="text-xs text-green-700 dark:text-green-400">
                                ✓ File uploaded and saved successfully
                              </p>
                            </div>
                          )}

                          {file.error && (
                            <div className="mt-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-900/30">
                              {file.error}
                            </div>
                          )}
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

                {selectedFiles.some((f) => f.status === "pending") && (
                  <Button
                    className="flex-1"
                    onClick={startUpload}
                    disabled={selectedFiles.some(
                      (f) => f.status === "uploading",
                    )}
                  >
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
  );
};

// Memoize to prevent unnecessary re-renders from parent state changes
export const UploadModal = React.memo(UploadModalContent);
