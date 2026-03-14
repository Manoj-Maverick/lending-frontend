import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useLoanSchedule } from "hooks/loans/useLoanDetails";
import { useToast } from "context/ToastContext";
import { useForeCloseLoan } from "hooks/loans/useForeCloseLoan";
import CreateLoanModal from "pages/loans-management/components/CreateLoanModal";
import { formatCurrencyINR as formatCurrency } from "utils/format";
const ForecloseModal = ({ isOpen, onClose, loanData }) => {
  const { showToast } = useToast();
  const { data: scheduleData = [] } = useLoanSchedule(loanData?.loanId);
  const forecloseMutation = useForeCloseLoan();

  const [isCreateNewLoanOpen, setCreateNewLoanOpen] = useState(false);

  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [referenceId, setReferenceId] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [showRenewalPrompt, setShowRenewalPrompt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPaidAmount("");
      setPaymentMethod("CASH");
      setReferenceId("");
      setIsProcessing(false);
      setShowRenewalPrompt(false);
      setCreateNewLoanOpen(false);
    }
  }, [isOpen]);

  const remainingPrincipal = Number(loanData?.remainingBalance || 0);

  const totalPendingFines = scheduleData.reduce((sum, item) => {
    if (item.status !== "PAID") {
      return sum + Number(item.fine_amount || 0);
    }
    return sum;
  }, 0);

  const estimatedInterestTillToday = 0;

  const settlementAmount =
    remainingPrincipal + totalPendingFines + estimatedInterestTillToday;

  const handleForeclose = async () => {
    if (!paidAmount || Number(paidAmount) < settlementAmount) {
      showToast(
        `Amount must be at least ₹${settlementAmount.toLocaleString("en-IN")}`,
        "error",
      );
      return;
    }

    try {
      setIsProcessing(true);

      await forecloseMutation.mutateAsync({
        loan_id: loanData.loanId,
        paid_amount: Number(paidAmount),
        payment_mode: paymentMethod,
        reference_no: referenceId || null,
      });

      showToast("Loan foreclosed successfully", "success");

      // show renewal prompt
      setShowRenewalPrompt(true);
    } catch (err) {
      console.error(err);
      showToast(
        err?.response?.data?.message || "Failed to foreclose loan",
        "error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRenewNow = () => {
    setShowRenewalPrompt(false);
    setCreateNewLoanOpen(true);
  };

  const handleNoRenew = () => {
    setShowRenewalPrompt(false);
    onClose();
  };

  const handleCloseCreateLoan = () => {
    setCreateNewLoanOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="form-modal-overlay fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className="
            bg-card rounded-xl shadow-2xl 
            w-full max-w-md sm:max-w-lg 
            max-h-[85vh] overflow-hidden 
            border border-border 
            flex flex-col
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Icon name="Lock" size={18} className="text-red-500" />
              </div>
              <h2 className="text-lg font-bold">Foreclose Loan</h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted rounded-full"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            <div className="p-3 bg-muted/50 rounded-lg border text-sm">
              <p className="text-xs text-muted-foreground mb-1">Borrower</p>
              <p className="font-semibold">{loanData?.clientName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Loan: {loanData?.loanId} • Remaining:{" "}
                {formatCurrency(remainingPrincipal)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg border text-sm">
                <p className="text-xs text-muted-foreground">
                  Remaining Principal
                </p>
                <p className="text-lg font-bold">
                  {formatCurrency(remainingPrincipal)}
                </p>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg border text-sm">
                <p className="text-xs text-muted-foreground">Pending Fines</p>
                <p className="text-lg font-bold">
                  {formatCurrency(totalPendingFines)}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-lg bg-red-500/5 border border-red-500/20 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Final Settlement Amount
              </p>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(settlementAmount)}
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Amount Received"
              />

              <Select
                value={paymentMethod}
                onChange={setPaymentMethod}
                options={[
                  { value: "CASH", label: "Cash" },
                  { value: "ONLINE", label: "Online" },
                  { value: "CHEQUE", label: "Cheque" },
                ]}
              />

              <Input
                type="text"
                placeholder="Reference ID"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border bg-muted/30 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleForeclose}
              disabled={
                isProcessing ||
                forecloseMutation.isPending ||
                !paidAmount ||
                Number(paidAmount) < settlementAmount
              }
            >
              {isProcessing ? (
                <>
                  <Icon name="Loader" size={14} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Icon name="Lock" size={14} className="mr-2" />
                  Confirm Foreclosure
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Renewal Prompt */}
      {showRenewalPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
          <div className="bg-card rounded-xl p-6 max-w-sm w-full border border-border text-center shadow-2xl">
            <Icon
              name="CheckCircle"
              size={48}
              className="text-green-500 mx-auto mb-4"
            />
            <h3 className="text-lg font-bold mb-2">
              Loan Closed Successfully!
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Would you like to issue a new loan for this client now?
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleNoRenew}
                className="flex-1"
              >
                No, Later
              </Button>

              <Button onClick={handleRenewNow} className="flex-1">
                Yes, Renew Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Loan Modal */}
      <CreateLoanModal
        isOpen={isCreateNewLoanOpen}
        onClose={handleCloseCreateLoan}
        oldLoanId={loanData?.loanId}
        borrowerId={loanData?.clientId}
      />
    </>
  );
};

export default ForecloseModal;
