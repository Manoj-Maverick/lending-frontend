import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const AddPaymentModal = ({ isOpen, onClose, loanData }) => {
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [referenceId, setReferenceId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Animate amount display
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
    if (!amount || !referenceId) {
      alert("Please fill all fields");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      console.log("Payment added:", {
        loanId: loanData?.id,
        clientName: loanData?.clientName,
        clientCode: loanData?.clientCode,
        amount,
        method: paymentMethod,
        reference: referenceId,
      });

      // Reset form
      setAmount("");
      setDisplayAmount(0);
      setPaymentMethod("Cash");
      setReferenceId("");
      setIsProcessing(false);

      alert(
        `Payment of ₹${amount} added successfully for ${loanData?.clientName}!`,
      );
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6 md:p-8 border border-border">
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
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          {/* Client Info Card */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-2">
              Client Information
            </p>
            <div>
              <p className="font-semibold text-foreground">
                {loanData?.clientName}
              </p>
              <p className="text-sm text-muted-foreground">
                {loanData?.clientCode} • Loan: {loanData?.id}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            {/* Amount Input */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Amount (₹)
              </label>
              <Input
                type="number"
                placeholder="Enter payment amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Payment Method
              </label>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                options={[
                  { value: "Cash", label: "Cash" },
                  { value: "Bank Transfer", label: "Bank Transfer" },
                  { value: "Cheque", label: "Cheque" },
                  { value: "Online", label: "Online" },
                ]}
              />
            </div>

            {/* Reference ID */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Reference ID
              </label>
              <Input
                type="text"
                placeholder="Transaction reference / Receipt number"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
              />
            </div>
          </div>

          {/* Amount Display */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border border-primary/30">
            <p className="text-sm text-muted-foreground text-center mb-1">
              Payment Amount
            </p>
            <p className="text-4xl font-bold text-center text-primary">
              ₹{displayAmount.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Action Buttons */}
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
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              onClick={handleAddPayment}
              disabled={isProcessing || !amount}
            >
              {isProcessing ? (
                <>
                  <Icon name="Loader" size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  Add ₹{amount || "0"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPaymentModal;
