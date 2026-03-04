import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import DocumentCaptureField from "../../../components/ui/DocumentCaptureField";
import { useCreateClient } from "../../../hooks/clients.management.page.hooks/useCreateClient";
import { useToast } from "context/ToastContext";
import { useUIContext } from "context/UIContext";
const AddClientModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [addGuarantorNow, setAddGuarantorNow] = useState(false);
  const { mutate: createClient, isPending, error } = useCreateClient();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "Ravi Kumar",
    dateOfBirth: "1994-08-15",
    gender: "Male",
    maritalStatus: "Married",
    email: "ravi.kumar94@gmail.com",
    phone: "9876543210",
    alternatePhone: "9123456780",
    occupation: "Shop Owner",
    monthlyIncome: "35000",
    aadhaarNumber: "567812349876",
    panNumber: "ABCDE1234F",
    addressLine1: "12, MG Road",
    addressLine2: "Near Bus Stand",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641001",
    residenceType: "Owned",
    yearsAtAddress: "6",
    bankName: "State Bank of India",
    accountNumber: "123456789012",
    ifscCode: "SBIN0000456",
    accountType: "Savings",
    accountHolderName: "Ravi Kumar",
    guarantorFullName: "",
    guarantorPhone: "",
    guarantorRelation: "",
    guarantorAddress: "",
    guarantorOccupation: "",
    guarantorMonthlyIncome: "",
    guarantorAadhaar: "",
    guarantorPan: "",
    guarantorAlternatePhone: "",
    guarantorEmail: "",
    guarantorCity: "",
    guarantorState: "",
    guarantorPincode: "",
    photo: null,
    idProof: null,
    addressProof: null,
    incomeProof: null,
    branch: "BR001",
    customerCode: "",
  });
  const { branches } = useUIContext();
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: "Personal", icon: "User" },
    { number: 2, title: "Address", icon: "MapPin" },
    { number: 3, title: "Bank & KYC", icon: "CreditCard" },
    { number: 4, title: "Guarantor", icon: "Users" },
    { number: 5, title: "Documents", icon: "FileText" },
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
    { value: "savings", label: "Savings" },
    { value: "current", label: "Current" },
  ];

  const branchOptions = [
    ...branches.map((b) => ({ value: b.id, label: b.branch_name })),
  ];

  const relationOptions = [
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "spouse", label: "Spouse" },
    { value: "sibling", label: "Brother/Sister" },
    { value: "friend", label: "Friend" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    if (!formData.customerCode) {
      const code = `CUST-${Math.floor(100000 + Math.random() * 900000)}`;
      setFormData((prev) => ({ ...prev, customerCode: code }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName?.trim())
        newErrors.fullName = "Full name is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.phone?.trim()) newErrors.phone = "Phone is required";
      else if (!/^\d{10}$/.test(formData.phone))
        newErrors.phone = "Invalid phone number";
    }

    if (step === 2) {
      if (!formData.addressLine1?.trim())
        newErrors.addressLine1 = "Address is required";
      if (!formData.city?.trim()) newErrors.city = "City is required";
      if (!formData.state?.trim()) newErrors.state = "State is required";
      if (!formData.pincode?.trim()) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.pincode))
        newErrors.pincode = "Invalid pincode";
    }

    if (step === 3) {
      if (!formData.bankName?.trim())
        newErrors.bankName = "Bank name is required";
      if (!formData.accountNumber?.trim())
        newErrors.accountNumber = "Account number is required";
      if (!formData.ifscCode?.trim())
        newErrors.ifscCode = "IFSC code is required";
      if (!formData.accountType)
        newErrors.accountType = "Account type is required";
      if (!formData.accountHolderName?.trim())
        newErrors.accountHolderName = "Account holder name is required";
    }

    if (step === 4 && addGuarantorNow) {
      if (!formData.guarantorFullName?.trim())
        newErrors.guarantorFullName = "Guarantor name is required";
      if (!formData.guarantorPhone?.trim())
        newErrors.guarantorPhone = "Guarantor phone is required";
      else if (!/^\d{10}$/.test(formData.guarantorPhone))
        newErrors.guarantorPhone = "Invalid phone";
      if (!formData.guarantorRelation)
        newErrors.guarantorRelation = "Relation is required";
    }

    if (step === 5) {
      if (!formData.branch) newErrors.branch = "Please select a branch";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const fd = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          key !== "photo" &&
          key !== "idProof" &&
          key !== "addressProof" &&
          key !== "incomeProof"
        ) {
          fd.append(key, value);
        }
      });

      // Append files
      if (formData.photo) fd.append("photo", formData.photo);
      if (formData.idProof) fd.append("idProof", formData.idProof);
      if (formData.addressProof)
        fd.append("addressProof", formData.addressProof);
      if (formData.incomeProof) fd.append("incomeProof", formData.incomeProof);

      createClient(fd, {
        onSuccess: () => {
          showToast("Client created successfully", "success");

          // ⏱ Close modal after 1 second
          setTimeout(() => {
            handleClose();
          }, 1000);
        },
        onError: (err) => {
          console.error("Create client failed:", err);

          showToast(
            err?.message || "Failed to create client. Please try again.",
            "error",
          );
        },
      });
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setAddGuarantorNow(false);
    setFormData({
      fullName: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      email: "",
      phone: "",
      alternatePhone: "",
      occupation: "",
      monthlyIncome: "",
      aadhaarNumber: "",
      panNumber: "",
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
      accountHolderName: "",
      guarantorFullName: "",
      guarantorPhone: "",
      guarantorRelation: "",
      guarantorAddress: "",
      guarantorOccupation: "",
      guarantorMonthlyIncome: "",
      guarantorAadhaar: "",
      guarantorPan: "",
      guarantorAlternatePhone: "",
      guarantorEmail: "",
      guarantorCity: "",
      guarantorState: "",
      guarantorPincode: "",
      photo: null,
      idProof: null,
      addressProof: null,
      incomeProof: null,
      branch: "",
      customerCode: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[96vh] sm:max-h-[92vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Add New Client
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
              Fill in the details to create a new client profile
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon
              name="X"
              size={22}
              className="text-gray-600 dark:text-gray-300 sm:size-24"
            />
          </button>
        </div>

        {/* Responsive Progress Bar */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-wrap items-center mx-auto justify-center sm:justify-between gap-2 sm:gap-0 max-w-full sm:max-w-3xl">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all flex-shrink-0 ${
                      currentStep === step.number
                        ? "bg-blue-600 text-white ring-2 ring-blue-300"
                        : currentStep > step.number
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Icon name="Check" size={18} className="sm:size-20" />
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Title - hidden on small screens, shown on md+ */}
                  <span className="text-[10px] sm:text-xs mt-1.5 sm:mt-2 font-medium text-gray-600 dark:text-gray-300 hidden sm:block whitespace-nowrap">
                    {step.title}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 min-w-[16px] sm:min-w-[32px] mx-1 sm:mx-4 ${
                      currentStep > step.number
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
                error={errors.fullName}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  required
                  error={errors.dateOfBirth}
                />
                <Select
                  label="Gender"
                  options={genderOptions}
                  value={formData.gender}
                  onChange={(v) => handleInputChange("gender", v)}
                  required
                  error={errors.gender}
                />
              </div>
              <Select
                label="Marital Status"
                options={maritalStatusOptions}
                value={formData.maritalStatus}
                onChange={(v) => handleInputChange("maritalStatus", v)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  error={errors.phone}
                />
                <Input
                  label="Alternate Phone"
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) =>
                    handleInputChange("alternatePhone", e.target.value)
                  }
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Occupation"
                  value={formData.occupation}
                  onChange={(e) =>
                    handleInputChange("occupation", e.target.value)
                  }
                />
                <Input
                  label="Monthly Income (₹)"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) =>
                    handleInputChange("monthlyIncome", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Input
                label="Address Line 1"
                value={formData.addressLine1}
                onChange={(e) =>
                  handleInputChange("addressLine1", e.target.value)
                }
                required
                error={errors.addressLine1}
              />
              <Input
                label="Address Line 2 (optional)"
                value={formData.addressLine2}
                onChange={(e) =>
                  handleInputChange("addressLine2", e.target.value)
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                  error={errors.city}
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  required
                  error={errors.state}
                />
                <Input
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  required
                  error={errors.pincode}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Residence Type"
                  options={residenceTypeOptions}
                  value={formData.residenceType}
                  onChange={(v) => handleInputChange("residenceType", v)}
                />
                <Input
                  label="Years at this Address"
                  type="number"
                  value={formData.yearsAtAddress}
                  onChange={(e) =>
                    handleInputChange("yearsAtAddress", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Input
                label="Bank Name"
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                required
                error={errors.bankName}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Account Number"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                  required
                  error={errors.accountNumber}
                />
                <Input
                  label="IFSC Code"
                  value={formData.ifscCode}
                  onChange={(e) =>
                    handleInputChange("ifscCode", e.target.value)
                  }
                  required
                  error={errors.ifscCode}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Account Type"
                  options={accountTypeOptions}
                  value={formData.accountType}
                  onChange={(v) => handleInputChange("accountType", v)}
                  required
                  error={errors.accountType}
                />
                <Input
                  label="Account Holder Name"
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    handleInputChange("accountHolderName", e.target.value)
                  }
                  required
                  error={errors.accountHolderName}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Aadhaar Number"
                  value={formData.aadhaarNumber}
                  onChange={(e) =>
                    handleInputChange("aadhaarNumber", e.target.value)
                  }
                  maxLength={12}
                />
                <Input
                  label="PAN Number"
                  value={formData.panNumber}
                  onChange={(e) =>
                    handleInputChange("panNumber", e.target.value)
                  }
                  maxLength={10}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Guarantor Information
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {addGuarantorNow
                      ? "Enter guarantor details now"
                      : "You can add a guarantor later from the client profile"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAddGuarantorNow(false)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      !addGuarantorNow
                        ? "bg-gray-800 text-white shadow-md"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Add Later
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddGuarantorNow(true)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      addGuarantorNow
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Add Now
                  </button>
                </div>
              </div>

              {addGuarantorNow && (
                <div className="space-y-6 pt-4 animate-fade-in">
                  <Input
                    label="Guarantor Full Name"
                    value={formData.guarantorFullName}
                    onChange={(e) =>
                      handleInputChange("guarantorFullName", e.target.value)
                    }
                    required
                    error={errors.guarantorFullName}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.guarantorPhone}
                      onChange={(e) =>
                        handleInputChange("guarantorPhone", e.target.value)
                      }
                      required
                      error={errors.guarantorPhone}
                    />
                    <Select
                      label="Relation"
                      options={relationOptions}
                      value={formData.guarantorRelation}
                      onChange={(v) =>
                        handleInputChange("guarantorRelation", v)
                      }
                      required
                      error={errors.guarantorRelation}
                    />
                  </div>
                  <Input
                    label="Address"
                    value={formData.guarantorAddress}
                    onChange={(e) =>
                      handleInputChange("guarantorAddress", e.target.value)
                    }
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Occupation"
                      value={formData.guarantorOccupation}
                      onChange={(e) =>
                        handleInputChange("guarantorOccupation", e.target.value)
                      }
                    />
                    <Input
                      label="Monthly Income (₹)"
                      type="number"
                      value={formData.guarantorMonthlyIncome}
                      onChange={(e) =>
                        handleInputChange(
                          "guarantorMonthlyIncome",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="City"
                      value={formData.guarantorCity}
                      onChange={(e) =>
                        handleInputChange("guarantorCity", e.target.value)
                      }
                    />
                    <Input
                      label="State"
                      value={formData.guarantorState}
                      onChange={(e) =>
                        handleInputChange("guarantorState", e.target.value)
                      }
                    />
                    <Input
                      label="Pincode"
                      value={formData.guarantorPincode}
                      onChange={(e) =>
                        handleInputChange("guarantorPincode", e.target.value)
                      }
                      maxLength={6}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Aadhaar Number"
                      value={formData.guarantorAadhaar}
                      onChange={(e) =>
                        handleInputChange("guarantorAadhaar", e.target.value)
                      }
                      maxLength={12}
                    />
                    <Input
                      label="PAN Number"
                      value={formData.guarantorPan}
                      onChange={(e) =>
                        handleInputChange("guarantorPan", e.target.value)
                      }
                      maxLength={10}
                    />
                  </div>
                </div>
              )}

              {!addGuarantorNow && (
                <div className="py-10 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                  <Icon
                    name="Users"
                    size={48}
                    className="mx-auto mb-4 opacity-60"
                  />
                  <p className="text-lg font-medium">
                    No guarantor added at this time
                  </p>
                  <p className="text-sm mt-2">
                    You can add one later from the client profile page
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentCaptureField
                  label="Client Photo"
                  accept="image/*"
                  value={formData.photo}
                  onChange={(file) => handleInputChange("photo", file)}
                  helperText="Profile photo"
                />
                <DocumentCaptureField
                  label="ID Proof (Aadhaar/PAN)"
                  accept=".pdf,image/*"
                  value={formData.idProof}
                  onChange={(file) => handleInputChange("idProof", file)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentCaptureField
                  label="Address Proof"
                  accept=".pdf,image/*"
                  value={formData.addressProof}
                  onChange={(file) => handleInputChange("addressProof", file)}
                />
                <DocumentCaptureField
                  label="Income Proof (optional)"
                  accept=".pdf,image/*"
                  value={formData.incomeProof}
                  onChange={(file) => handleInputChange("incomeProof", file)}
                />
              </div>
              <Select
                label="Assign to Branch"
                options={branchOptions}
                value={formData.branch}
                onChange={(v) => handleInputChange("branch", v)}
                required
                error={errors.branch}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between text-sm">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            size="sm"
          >
            <Icon name="ChevronLeft" className="mr-1.5" size={16} />
            Back
          </Button>

          <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} size="sm">
              Next
              <Icon name="ChevronRight" className="ml-1.5" size={16} />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              iconName={isPending ? "Loader" : "Check"}
              iconPosition="left"
              disabled={isPending}
              size="sm"
            >
              {isPending ? "Creating Client..." : "Create Client"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
