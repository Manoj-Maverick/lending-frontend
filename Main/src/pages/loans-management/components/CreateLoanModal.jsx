import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const CreateLoanModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientId: "",
    loanAmount: "",
    loanType: "personal",
    interestRate: "",
    tenure: "",
    purpose: "",
    collateral: "",
    guarantorName: "",
    guarantorPhone: "",
  });

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData?.clientId)
        newErrors.clientId = "Client selection is required";
      if (!formData?.loanAmount || parseFloat(formData?.loanAmount) <= 0) {
        newErrors.loanAmount = "Valid loan amount is required";
      }
      if (!formData?.loanType) newErrors.loanType = "Loan type is required";
    }
    if (step === 2) {
      if (!formData?.interestRate || parseFloat(formData?.interestRate) <= 0) {
        newErrors.interestRate = "Valid interest rate is required";
      }
      if (!formData?.tenure || parseInt(formData?.tenure) <= 0) {
        newErrors.tenure = "Valid tenure is required";
      }
      if (!formData?.purpose) newErrors.purpose = "Loan purpose is required";
    }
    if (step === 3) {
      if (!formData?.guarantorName)
        newErrors.guarantorName = "Guarantor name is required";
      if (!formData?.guarantorPhone)
        newErrors.guarantorPhone = "Guarantor phone is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
      setFormData({
        clientId: "",
        loanAmount: "",
        loanType: "personal",
        interestRate: "",
        tenure: "",
        purpose: "",
        collateral: "",
        guarantorName: "",
        guarantorPhone: "",
      });
      setCurrentStep(1);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors?.[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (!isOpen) return null;

  const calculateEMI = () => {
    const principal = parseFloat(formData?.loanAmount) || 0;
    const rate = parseFloat(formData?.interestRate) / 100 / 12 || 0;
    const time = parseInt(formData?.tenure) || 0;
    if (principal > 0 && rate > 0 && time > 0) {
      const emi =
        (principal * rate * Math.pow(1 + rate, time)) /
        (Math.pow(1 + rate, time) - 1);
      return emi?.toFixed(2);
    }
    return "0";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-elevation-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Create New Loan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step {currentStep} of 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3]?.map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                      ? "bg-accent text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? "bg-accent" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Loan Details
              </h3>
              <Select
                label="Select Client"
                value={formData?.clientId}
                onChange={(e) => handleChange("clientId", e?.target?.value)}
                options={[
                  { value: "", label: "Choose a client..." },
                  { value: "CL001", label: "Rajesh Kumar (CL-001)" },
                  { value: "CL002", label: "Priya Sharma (CL-002)" },
                  { value: "CL003", label: "Amit Patel (CL-003)" },
                  { value: "CL004", label: "Sunita Devi (CL-004)" },
                  { value: "CL005", label: "Vikram Singh (CL-005)" },
                ]}
                error={errors?.clientId}
                required
              />
              <Input
                label="Loan Amount"
                type="number"
                placeholder="Enter loan amount"
                value={formData?.loanAmount}
                onChange={(e) => handleChange("loanAmount", e?.target?.value)}
                error={errors?.loanAmount}
                required
                min="1"
                step="1000"
              />
              <Select
                label="Loan Type"
                value={formData?.loanType}
                onChange={(e) => handleChange("loanType", e?.target?.value)}
                options={[
                  { value: "personal", label: "Personal Loan" },
                  { value: "business", label: "Business Loan" },
                  { value: "gold", label: "Gold Loan" },
                  { value: "vehicle", label: "Vehicle Loan" },
                ]}
                error={errors?.loanType}
                required
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Terms & Conditions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Interest Rate (%)"
                  type="number"
                  placeholder="Enter interest rate"
                  value={formData?.interestRate}
                  onChange={(e) =>
                    handleChange("interestRate", e?.target?.value)
                  }
                  error={errors?.interestRate}
                  required
                  min="0.1"
                  step="0.1"
                />
                <Input
                  label="Tenure (Months)"
                  type="number"
                  placeholder="Enter tenure"
                  value={formData?.tenure}
                  onChange={(e) => handleChange("tenure", e?.target?.value)}
                  error={errors?.tenure}
                  required
                  min="1"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Loan Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Describe the purpose of the loan..."
                  value={formData?.purpose}
                  onChange={(e) => handleChange("purpose", e?.target?.value)}
                />
                {errors?.purpose && (
                  <p className="text-xs text-red-500 mt-1">{errors?.purpose}</p>
                )}
              </div>
              <Input
                label="Collateral (Optional)"
                type="text"
                placeholder="Enter collateral details"
                value={formData?.collateral}
                onChange={(e) => handleChange("collateral", e?.target?.value)}
              />
              {formData?.loanAmount &&
                formData?.interestRate &&
                formData?.tenure && (
                  <div className="bg-accent/10 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon
                        name="Calculator"
                        size={16}
                        className="text-accent"
                      />
                      <span className="text-muted-foreground">
                        EMI Calculation
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      ₹{parseFloat(calculateEMI())?.toLocaleString()}/month
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Payable: ₹
                      {(
                        parseFloat(calculateEMI()) * parseInt(formData?.tenure)
                      )?.toLocaleString()}
                    </div>
                  </div>
                )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Guarantor Information
              </h3>
              <Input
                label="Guarantor Name"
                type="text"
                placeholder="Enter guarantor name"
                value={formData?.guarantorName}
                onChange={(e) =>
                  handleChange("guarantorName", e?.target?.value)
                }
                error={errors?.guarantorName}
                required
              />
              <Input
                label="Guarantor Phone"
                type="tel"
                placeholder="Enter guarantor phone number"
                value={formData?.guarantorPhone}
                onChange={(e) =>
                  handleChange("guarantorPhone", e?.target?.value)
                }
                error={errors?.guarantorPhone}
                required
              />
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="FileText" size={16} className="text-accent" />
                  <span className="font-semibold text-foreground">
                    Loan Summary
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Loan Amount:</span>
                  <span className="text-foreground font-semibold text-right">
                    ₹
                    {formData?.loanAmount
                      ? parseFloat(formData?.loanAmount)?.toLocaleString()
                      : "0"}
                  </span>
                  <span className="text-muted-foreground">Interest Rate:</span>
                  <span className="text-foreground font-medium text-right">
                    {formData?.interestRate || "0"}%
                  </span>
                  <span className="text-muted-foreground">Tenure:</span>
                  <span className="text-foreground font-medium text-right">
                    {formData?.tenure || "0"} Months
                  </span>
                  <span className="text-muted-foreground">Monthly EMI:</span>
                  <span className="text-foreground font-semibold text-right">
                    ₹{parseFloat(calculateEMI())?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="w-full sm:w-auto"
              >
                <Icon name="ChevronLeft" size={16} />
                Back
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="w-full sm:flex-1"
              >
                Next
                <Icon name="ChevronRight" size={16} />
              </Button>
            ) : (
              <Button type="submit" className="w-full sm:flex-1">
                <Icon name="CheckCircle" size={16} />
                Create Loan
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLoanModal;
