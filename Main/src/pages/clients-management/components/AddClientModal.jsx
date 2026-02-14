import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const AddClientModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    email: "",
    phone: "",
    alternatePhone: "",
    // Address Information
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    residenceType: "",
    yearsAtAddress: "",
    // Bank Details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    // Guarantor Information
    guarantorName: "",
    guarantorPhone: "",
    guarantorRelation: "",
    guarantorAddress: "",
    // Documents & Branch
    photo: null,
    idProof: null,
    addressProof: null,
    incomeProof: null,
    branch: "",
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: "Personal Details", icon: "User" },
    { number: 2, title: "Address Information", icon: "MapPin" },
    { number: 3, title: "Bank Details", icon: "CreditCard" },
    { number: 4, title: "Guarantor Information", icon: "Users" },
    { number: 5, title: "Documents & Branch", icon: "FileText" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
  ];

  const residenceTypeOptions = [
    { value: "owned", label: "Owned" },
    { value: "rented", label: "Rented" },
    { value: "family", label: "Family Owned" },
  ];

  const accountTypeOptions = [
    { value: "savings", label: "Savings Account" },
    { value: "current", label: "Current Account" },
  ];

  const branchOptions = [
    { value: "br-001", label: "Main Branch" },
    { value: "br-002", label: "North Branch" },
    { value: "br-003", label: "South Branch" },
    { value: "br-004", label: "East Branch" },
    { value: "br-005", label: "West Branch" },
  ];

  const relationOptions = [
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "spouse", label: "Spouse" },
    { value: "sibling", label: "Sibling" },
    { value: "friend", label: "Friend" },
    { value: "other", label: "Other" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.firstName?.trim())
        newErrors.firstName = "First name is required";
      if (!formData?.lastName?.trim())
        newErrors.lastName = "Last name is required";
      if (!formData?.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData?.gender) newErrors.gender = "Gender is required";
      if (!formData?.phone?.trim())
        newErrors.phone = "Phone number is required";
      else if (!/^\d{10}$/?.test(formData?.phone))
        newErrors.phone = "Invalid phone number";
    }

    if (step === 2) {
      if (!formData?.addressLine1?.trim())
        newErrors.addressLine1 = "Address is required";
      if (!formData?.city?.trim()) newErrors.city = "City is required";
      if (!formData?.state?.trim()) newErrors.state = "State is required";
      if (!formData?.pincode?.trim()) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/?.test(formData?.pincode))
        newErrors.pincode = "Invalid pincode";
    }

    if (step === 3) {
      if (!formData?.bankName?.trim())
        newErrors.bankName = "Bank name is required";
      if (!formData?.accountNumber?.trim())
        newErrors.accountNumber = "Account number is required";
      if (!formData?.ifscCode?.trim())
        newErrors.ifscCode = "IFSC code is required";
      if (!formData?.accountType)
        newErrors.accountType = "Account type is required";
    }

    if (step === 4) {
      if (!formData?.guarantorName?.trim())
        newErrors.guarantorName = "Guarantor name is required";
      if (!formData?.guarantorPhone?.trim())
        newErrors.guarantorPhone = "Guarantor phone is required";
      else if (!/^\d{10}$/?.test(formData?.guarantorPhone))
        newErrors.guarantorPhone = "Invalid phone number";
      if (!formData?.guarantorRelation)
        newErrors.guarantorRelation = "Relation is required";
    }

    if (step === 5) {
      if (!formData?.branch) newErrors.branch = "Branch selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      email: "",
      phone: "",
      alternatePhone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      residenceType: "",
      yearsAtAddress: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "",
      guarantorName: "",
      guarantorPhone: "",
      guarantorRelation: "",
      guarantorAddress: "",
      photo: null,
      idProof: null,
      addressProof: null,
      incomeProof: null,
      branch: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-elevation-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Add New Client
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Complete all steps to create client profile
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-4 md:px-6 py-4 border-b border-border bg-muted/30 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {steps?.map((step, index) => (
              <React.Fragment key={step?.number}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep === step?.number
                        ? "bg-accent text-white"
                        : currentStep > step?.number
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step?.number ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step?.icon} size={16} />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div
                      className={`text-xs font-medium ${currentStep >= step?.number ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      Step {step?.number}
                    </div>
                    <div
                      className={`text-xs ${currentStep === step?.number ? "text-accent" : "text-muted-foreground"}`}
                    >
                      {step?.title}
                    </div>
                  </div>
                </div>
                {index < steps?.length - 1 && (
                  <div
                    className={`h-0.5 w-8 md:w-12 ${currentStep > step?.number ? "bg-accent" : "bg-border"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="Enter first name"
                  value={formData?.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e?.target?.value)
                  }
                  error={errors?.firstName}
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Enter last name"
                  value={formData?.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e?.target?.value)
                  }
                  error={errors?.lastName}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData?.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e?.target?.value)
                  }
                  error={errors?.dateOfBirth}
                  required
                />
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  options={genderOptions}
                  value={formData?.gender}
                  onChange={(value) => handleInputChange("gender", value)}
                  error={errors?.gender}
                  required
                />
              </div>
              <Select
                label="Marital Status"
                placeholder="Select marital status"
                options={maritalStatusOptions}
                value={formData?.maritalStatus}
                onChange={(value) => handleInputChange("maritalStatus", value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange("phone", e?.target?.value)}
                  error={errors?.phone}
                  required
                />
                <Input
                  label="Alternate Phone"
                  type="tel"
                  placeholder="Enter alternate phone (optional)"
                  value={formData?.alternatePhone}
                  onChange={(e) =>
                    handleInputChange("alternatePhone", e?.target?.value)
                  }
                />
              </div>
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter email address (optional)"
                value={formData?.email}
                onChange={(e) => handleInputChange("email", e?.target?.value)}
              />
            </div>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Input
                label="Address Line 1"
                type="text"
                placeholder="House/Flat number, Street name"
                value={formData?.addressLine1}
                onChange={(e) =>
                  handleInputChange("addressLine1", e?.target?.value)
                }
                error={errors?.addressLine1}
                required
              />
              <Input
                label="Address Line 2"
                type="text"
                placeholder="Locality, Landmark (optional)"
                value={formData?.addressLine2}
                onChange={(e) =>
                  handleInputChange("addressLine2", e?.target?.value)
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  type="text"
                  placeholder="Enter city"
                  value={formData?.city}
                  onChange={(e) => handleInputChange("city", e?.target?.value)}
                  error={errors?.city}
                  required
                />
                <Input
                  label="State"
                  type="text"
                  placeholder="Enter state"
                  value={formData?.state}
                  onChange={(e) => handleInputChange("state", e?.target?.value)}
                  error={errors?.state}
                  required
                />
                <Input
                  label="Pincode"
                  type="text"
                  placeholder="6-digit pincode"
                  value={formData?.pincode}
                  onChange={(e) =>
                    handleInputChange("pincode", e?.target?.value)
                  }
                  error={errors?.pincode}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Residence Type"
                  placeholder="Select residence type"
                  options={residenceTypeOptions}
                  value={formData?.residenceType}
                  onChange={(value) =>
                    handleInputChange("residenceType", value)
                  }
                />
                <Input
                  label="Years at Current Address"
                  type="number"
                  placeholder="Enter years"
                  value={formData?.yearsAtAddress}
                  onChange={(e) =>
                    handleInputChange("yearsAtAddress", e?.target?.value)
                  }
                />
              </div>
            </div>
          )}

          {/* Step 3: Bank Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <Input
                label="Bank Name"
                type="text"
                placeholder="Enter bank name"
                value={formData?.bankName}
                onChange={(e) =>
                  handleInputChange("bankName", e?.target?.value)
                }
                error={errors?.bankName}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Account Number"
                  type="text"
                  placeholder="Enter account number"
                  value={formData?.accountNumber}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e?.target?.value)
                  }
                  error={errors?.accountNumber}
                  required
                />
                <Input
                  label="IFSC Code"
                  type="text"
                  placeholder="Enter IFSC code"
                  value={formData?.ifscCode}
                  onChange={(e) =>
                    handleInputChange("ifscCode", e?.target?.value)
                  }
                  error={errors?.ifscCode}
                  required
                />
              </div>
              <Select
                label="Account Type"
                placeholder="Select account type"
                options={accountTypeOptions}
                value={formData?.accountType}
                onChange={(value) => handleInputChange("accountType", value)}
                error={errors?.accountType}
                required
              />
            </div>
          )}

          {/* Step 4: Guarantor Information */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <Input
                label="Guarantor Full Name"
                type="text"
                placeholder="Enter guarantor name"
                value={formData?.guarantorName}
                onChange={(e) =>
                  handleInputChange("guarantorName", e?.target?.value)
                }
                error={errors?.guarantorName}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Guarantor Phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={formData?.guarantorPhone}
                  onChange={(e) =>
                    handleInputChange("guarantorPhone", e?.target?.value)
                  }
                  error={errors?.guarantorPhone}
                  required
                />
                <Select
                  label="Relation with Client"
                  placeholder="Select relation"
                  options={relationOptions}
                  value={formData?.guarantorRelation}
                  onChange={(value) =>
                    handleInputChange("guarantorRelation", value)
                  }
                  error={errors?.guarantorRelation}
                  required
                />
              </div>
              <Input
                label="Guarantor Address"
                type="text"
                placeholder="Enter guarantor address"
                value={formData?.guarantorAddress}
                onChange={(e) =>
                  handleInputChange("guarantorAddress", e?.target?.value)
                }
              />
            </div>
          )}

          {/* Step 5: Documents & Branch */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Client Photo
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent transition-colors cursor-pointer">
                    <Icon
                      name="Upload"
                      size={24}
                      className="mx-auto mb-2 text-muted-foreground"
                    />
                    <p className="text-sm text-muted-foreground">
                      Click to upload photo
                    </p>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ID Proof
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent transition-colors cursor-pointer">
                    <Icon
                      name="FileText"
                      size={24}
                      className="mx-auto mb-2 text-muted-foreground"
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload ID proof
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address Proof
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent transition-colors cursor-pointer">
                    <Icon
                      name="FileText"
                      size={24}
                      className="mx-auto mb-2 text-muted-foreground"
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload address proof
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Income Proof (Optional)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent transition-colors cursor-pointer">
                    <Icon
                      name="FileText"
                      size={24}
                      className="mx-auto mb-2 text-muted-foreground"
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload income proof
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              </div>
              <Select
                label="Assign to Branch"
                placeholder="Select branch"
                options={branchOptions}
                value={formData?.branch}
                onChange={(value) => handleInputChange("branch", value)}
                error={errors?.branch}
                required
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {steps?.length}
          </div>
          {currentStep < steps?.length ? (
            <Button
              variant="default"
              onClick={handleNext}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleSubmit}
              iconName="Check"
              iconPosition="left"
            >
              Create Client
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
