import React, { useRef } from "react";
import Icon from "../AppIcon";
import Button from "./Button";

const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DocumentCaptureField = ({
  label,
  required = false,
  accept = ".pdf,.jpg,.jpeg,.png",
  value = null,
  onChange,
  helperText = "",
  cameraLabel = "Take Photo",
  uploadLabel = "Upload File",
}) => {
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event?.target?.files?.[0] || null;
    onChange?.(selectedFile);
    event.target.value = "";
  };

  const clearFile = () => {
    onChange?.(null);
  };

  return (
    <div className="glass-surface-soft rounded-xl p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
        {value && (
          <button
            type="button"
            onClick={clearFile}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Icon name="X" size={12} />
            Remove
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          iconName="Camera"
          onClick={() => cameraInputRef?.current?.click()}
        >
          {cameraLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          iconName="Upload"
          onClick={() => fileInputRef?.current?.click()}
        >
          {uploadLabel}
        </Button>
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <p className="mt-3 text-xs text-foreground/90">
          <span className="font-medium">{value?.name}</span>
          {value?.size ? ` • ${formatBytes(value.size)}` : ""}
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          {helperText || "No file selected"}
        </p>
      )}
    </div>
  );
};

export default DocumentCaptureField;
