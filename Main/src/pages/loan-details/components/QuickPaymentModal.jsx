import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useGetLoanSchedule } from "hooks/loans.details.page/useGetLoanSchedule";
import { useAddPayment } from "hooks/loans.details.page/recordPayment";
import { useToast } from "context/ToastContext";
import { set } from "date-fns";
const AddPaymentModal = ({ isOpen, onClose, loanData }) => {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useGetLoanSchedule(loanData?.loanId);

  const { mutate: addPayment } = useAddPayment();
  const { showToast } = useToast();
  const today = new Date().toLocaleDateString("en-CA");

  const todayDue = data.find((item) => {
    const dueLocal = new Date(item.due_date).toLocaleDateString("en-CA");
    return dueLocal === today && item.status !== "PAID";
  });

  const [amount, setAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [referenceId, setReferenceId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (todayDue) {
      setAmount(todayDue.due_amount);
    }
  }, [todayDue]);

  // Amount animation
  useEffect(() => {
    if (!amount) {
      setDisplayAmount(0);
      return;
    }

    const targetAmount = parseInt(amount) || 0;
    let currentAmount = displayAmount;

    const difference = targetAmount - currentAmount;
    const step = difference / 20;

    let frame = 0;

    const interval = setInterval(() => {
      frame++;

      if (frame < 20) {
        currentAmount += step;
        setDisplayAmount(Math.floor(currentAmount));
      } else {
        setDisplayAmount(targetAmount);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [amount]);

  const handleAddPayment = () => {
    if (!todayDue) return;

    setIsProcessing(true);

    addPayment(
      {
        schedule_id: todayDue.id,
        paid_amount: Number(amount),
        paid_date: today,
        payment_mode: paymentMethod,
        reference_no: referenceId || null,
      },
      {
        onSuccess: () => {
          showToast("Payment added successfully", "success");
          setReferenceId("");
          setIsProcessing(false);

          setTimeout(() => {
            onClose();
          }, 1000);
        },

        onError: (err) => {
          showToast("Payment failed", "error");
          setIsProcessing(false);
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="form-modal-overlay fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="form-modal-panel bg-card rounded-lg shadow-lg max-w-md w-full p-6 md:p-8 border border-border">
          {/* Header */}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="CreditCard" size={20} className="text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-foreground">
                Add Payment
              </h2>
            </div>

            <button onClick={onClose}>
              <Icon name="X" size={24} />
            </button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-10">
              <Icon name="Loader" size={28} className="animate-spin" />
            </div>
          )}

          {isError && (
            <div className="text-center py-6 text-red-500">
              {error?.message || "Failed to load schedule"}
            </div>
          )}

          {!isLoading && !isError && todayDue && (
            <>
              {/* Client Info */}

              <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Client Information
                </p>

                <p className="font-semibold text-foreground">
                  {loanData?.clientName}
                </p>

                <p className="text-sm text-muted-foreground">
                  {loanData?.clientCode} • Loan: {loanData?.loanId}
                </p>
              </div>

              {/* Form */}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Amount (₹)
                  </label>

                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Payment Method
                  </label>

                  <Select
                    value={paymentMethod}
                    onChange={(value) => setPaymentMethod(value)}
                    options={[
                      { value: "CASH", label: "Cash" },
                      { value: "ONLINE", label: "Online" },
                    ]}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Reference ID
                  </label>

                  <Input
                    type="text"
                    placeholder="Transaction reference"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                  />
                </div>
              </div>

              {/* Amount Display */}

              <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-center mb-1">Payment Amount</p>

                <p className="text-4xl font-bold text-center text-primary">
                  ₹{displayAmount.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Buttons */}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>

                <Button
                  className="flex-1"
                  onClick={handleAddPayment}
                  disabled={isProcessing || !amount}
                >
                  {isProcessing ? (
                    <>
                      <Icon
                        name="Loader"
                        size={16}
                        className="mr-2 animate-spin"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Icon name="CheckCircle" size={16} className="mr-2" />
                      Add ₹{amount}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {!isLoading && !isError && !todayDue && (
            <div className="flex flex-col items-center py-10 text-center">
              <Icon
                name="CheckCircle2"
                size={40}
                className="text-green-500 mb-4"
              />
              <h3 className="text-lg font-semibold mb-1">All Clear Today 🎉</h3>
              <p className="text-sm text-muted-foreground">
                No installments due today
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddPaymentModal;
