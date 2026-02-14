import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const BlocklistModal = ({
  isOpen,
  onClose,
  onConfirm,
  clientData = null,
  isUnblocking = false,
}) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm({ reason });
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!isOpen || !clientData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-lg max-w-md w-full animate-in fade-in zoom-in">
        {/* Header */}
        <div
          className={`flex items-center gap-3 p-6 border-b border-border ${
            isUnblocking ? "bg-emerald-500/10" : "bg-red-500/10"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isUnblocking ? "bg-emerald-500/20" : "bg-red-500/20"
            }`}
          >
            <Icon
              name={isUnblocking ? "CheckCircle2" : "AlertCircle"}
              size={20}
              className={isUnblocking ? "text-emerald-600" : "text-red-600"}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {isUnblocking ? "Unblock Customer" : "Block Customer"}
            </h2>
            <p className="text-sm text-muted-foreground">{clientData?.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-auto p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Client Info */}
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Client Code
                </p>
                <p className="text-sm font-mono font-medium text-foreground">
                  {clientData?.code}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                <p className="text-sm font-medium text-foreground">
                  {clientData?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div
            className={`rounded-lg p-3 mb-4 ${
              isUnblocking
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : "bg-red-500/10 border border-red-500/20"
            }`}
          >
            <p
              className={`text-sm ${
                isUnblocking
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {isUnblocking
                ? "This customer will be able to apply for loans again across all branches."
                : "This customer will be unable to apply for loans across all branches."}
            </p>
          </div>

          {/* Reason Input */}
          {!isUnblocking && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason for blocking
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason (e.g., Fraud, Default, Payment Issues, etc.)"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t border-border bg-muted/30">
          <Button variant="outline" size="sm" onClick={handleClose} fullWidth>
            Cancel
          </Button>
          <Button
            variant={isUnblocking ? "success" : "destructive"}
            size="sm"
            onClick={handleConfirm}
            fullWidth
          >
            <Icon
              name={isUnblocking ? "CheckCircle2" : "Ban"}
              size={16}
              className="mr-2"
            />
            {isUnblocking ? "Unblock Customer" : "Block Customer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlocklistModal;
