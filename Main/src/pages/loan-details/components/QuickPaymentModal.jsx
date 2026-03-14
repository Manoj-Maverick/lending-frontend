import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useLoanSchedule } from "hooks/loans/useLoanDetails";
import { useCreatePayment } from "hooks/payments/useCreatePayment";
import { useToast } from "context/ToastContext";

const AddPaymentModal = ({ isOpen, onClose, loanData }) => {
  const { data = [], isLoading } = useLoanSchedule(loanData?.loanId);

  const { mutate: addPayment } = useCreatePayment();
  const { showToast } = useToast();

  const today = new Date().toLocaleDateString("en-CA");

  const [mode, setMode] = useState("today");
  const [selectedInstallmentId, setSelectedInstallmentId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [referenceId, setReferenceId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  /* -------------------------
     Reset modal state
  ------------------------- */

  const resetState = () => {
    setMode("today");
    setSelectedInstallmentId(null);
    setAmount(0);
    setDisplayAmount(0);
    setReferenceId("");
    setPaymentMethod("CASH");
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  /* -------------------------
     Installment categories
  ------------------------- */

  const todayInstallments = data.filter((i) => {
    const due = new Date(i.due_date).toLocaleDateString("en-CA");
    return due === today && i.status !== "PAID" && i.status !== "DELAYED";
  });

  const overdueInstallments = data.filter((i) => {
    const due = new Date(i.due_date).toLocaleDateString("en-CA");
    return due < today && i.status !== "PAID" && i.status !== "DELAYED";
  });

  const futureInstallments = data.filter((i) => {
    const due = new Date(i.due_date).toLocaleDateString("en-CA");
    return due > today && i.status !== "PAID" && i.status !== "DELAYED";
  });

  let visibleInstallments = [];

  if (mode === "today") visibleInstallments = todayInstallments;
  if (mode === "overdue") visibleInstallments = overdueInstallments;
  if (mode === "advance") visibleInstallments = futureInstallments;

  /* -------------------------
     Default selection
  ------------------------- */

  useEffect(() => {
    if (visibleInstallments.length > 0) {
      setSelectedInstallmentId(visibleInstallments[0].id);
    } else {
      setSelectedInstallmentId(null);
    }
  }, [mode, data]);

  /* -------------------------
     Set amount
  ------------------------- */

  useEffect(() => {
    const selected = visibleInstallments.find(
      (i) => i.id === selectedInstallmentId,
    );

    if (selected) {
      setAmount(
        Number(selected.due_amount) + Number(selected.fine_amount || 0),
      );
    } else {
      setAmount(0);
    }
  }, [selectedInstallmentId, visibleInstallments]);

  /* -------------------------
     Amount animation
  ------------------------- */

  useEffect(() => {
    if (!amount) {
      setDisplayAmount(0);
      return;
    }

    const target = parseInt(amount);
    let current = displayAmount;
    const diff = target - current;
    const step = diff / 20;

    let frame = 0;

    const interval = setInterval(() => {
      frame++;

      if (frame < 20) {
        current += step;
        setDisplayAmount(Math.floor(current));
      } else {
        setDisplayAmount(target);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [amount]);

  /* -------------------------
     Submit payment
  ------------------------- */

  const handleAddPayment = () => {
    if (!selectedInstallmentId) {
      showToast("No installment selected", "error");
      return;
    }

    setIsProcessing(true);

    addPayment(
      {
        schedule_id: selectedInstallmentId,
        paid_amount: Number(amount),
        paid_date: today,
        payment_mode: paymentMethod,
        reference_no: referenceId || null,
      },
      {
        onSuccess: () => {
          showToast("Payment added successfully", "success");
          resetState();

          setTimeout(() => {
            onClose();
          }, 800);
        },
        onError: () => {
          showToast("Payment failed", "error");
          setIsProcessing(false);
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6 border border-border">
          {/* Header */}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="CreditCard" size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold">Add Payment</h2>
            </div>

            <button onClick={handleClose}>
              <Icon name="X" size={22} />
            </button>
          </div>

          {/* Borrower */}

          <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-2">
              Borrower Information
            </p>
            <p className="font-semibold">{loanData?.clientName}</p>
            <p className="text-sm text-muted-foreground">
              {loanData?.clientCode} • Loan: {loanData?.loanId}
            </p>
          </div>

          {/* No due today */}

          {mode === "today" && todayInstallments.length === 0 && (
            <div className="flex flex-col items-center py-8 text-center">
              <Icon
                name="CheckCircle2"
                size={44}
                className="text-emerald-500 animate-pulse mb-4"
              />

              <h3 className="font-semibold mb-2">No Due Today 🎉</h3>

              <p className="text-sm text-muted-foreground mb-6">
                You can still collect overdue or advance payments
              </p>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setMode("overdue")}>
                  Collect Overdue
                </Button>

                <Button variant="outline" onClick={() => setMode("advance")}>
                  Collect Advance
                </Button>
              </div>
            </div>
          )}

          {/* No overdue */}

          {mode === "overdue" && overdueInstallments.length === 0 && (
            <div className="flex flex-col items-center py-8 text-center">
              <Icon
                name="CheckCircle"
                size={40}
                className="text-emerald-500 mb-4"
              />

              <h3 className="font-semibold mb-2">No Overdue Payments</h3>

              <p className="text-sm text-muted-foreground mb-6">
                All installments are up to date
              </p>

              <Button variant="outline" onClick={() => setMode("today")}>
                Go Back
              </Button>
            </div>
          )}

          {/* Payment form */}

          {visibleInstallments.length > 0 && (
            <div className="space-y-5">
              {mode !== "today" && (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {mode === "overdue"
                      ? "Overdue Installments"
                      : "Future Installments"}
                  </p>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setMode("today")}
                  >
                    Back
                  </Button>
                </div>
              )}

              <Select
                value={selectedInstallmentId}
                onChange={setSelectedInstallmentId}
                options={visibleInstallments.map((i) => ({
                  value: i.id,
                  label: `#${i.installment_no} • Due ${new Date(
                    i.due_date,
                  ).toLocaleDateString("en-IN")}`,
                }))}
              />

              <Input label="Amount" value={amount} readOnly />

              <Select
                label="Payment Method"
                value={paymentMethod}
                onChange={setPaymentMethod}
                options={[
                  { value: "CASH", label: "Cash" },
                  { value: "ONLINE", label: "Online" },
                ]}
              />

              <Input
                label="Reference ID"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
              />

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-center mb-1">Payment Amount</p>
                <p className="text-3xl font-bold text-center text-primary">
                  ₹{displayAmount.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  className="flex-1"
                  onClick={handleAddPayment}
                  disabled={!selectedInstallmentId || isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay ₹${amount}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddPaymentModal;
