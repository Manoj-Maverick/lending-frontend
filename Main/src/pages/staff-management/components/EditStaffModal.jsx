import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const EditStaffModal = ({ isOpen, onClose, onSubmit, staffData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    alternatePhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    role: "",
    department: "",
    branch: "",
    joinDate: "",
    employmentType: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    status: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (staffData) {
      setFormData({
        firstName: staffData?.firstName || "",
        lastName: staffData?.lastName || "",
        dateOfBirth: staffData?.dateOfBirth || "",
        gender: staffData?.gender || "",
        email: staffData?.email || "",
        phone: staffData?.phone || "",
        alternatePhone: staffData?.alternatePhone || "",
        addressLine1: staffData?.addressLine1 || "",
        addressLine2: staffData?.addressLine2 || "",
        city: staffData?.city || "",
        state: staffData?.state || "",
        pincode: staffData?.pincode || "",
        role: staffData?.role || "",
        department: staffData?.department || "",
        branch: staffData?.branch || "",
        joinDate: staffData?.joinDate || "",
        employmentType: staffData?.employmentType || "",
        bankName: staffData?.bankName || "",
        accountNumber: staffData?.accountNumber || "",
        ifscCode: staffData?.ifscCode || "",
        accountType: staffData?.accountType || "",
        status: staffData?.status || "",
      });
    }
  }, [staffData, isOpen]);

  const steps = [
    { number: 1, title: "Personal Details", icon: "User" },
    { number: 2, title: "Address Information", icon: "MapPin" },
    { number: 3, title: "Employment Details", icon: "Briefcase" },
    { number: 4, title: "Bank Details", icon: "CreditCard" },
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const roleOptions = [
    { value: "Branch Manager", label: "Branch Manager" },
    { value: "Loan Officer", label: "Loan Officer" },
    { value: "Finance Manager", label: "Finance Manager" },
    {
      value: "Customer Service Executive",
      label: "Customer Service Executive",
    },
    { value: "HR Executive", label: "HR Executive" },
    { value: "IT Manager", label: "IT Manager" },
    { value: "Audit Officer", label: "Audit Officer" },
  ];

  const departmentOptions = [
    { value: "Management", label: "Management" },
    { value: "Operations", label: "Operations" },
    { value: "Finance", label: "Finance" },
    { value: "Customer Service", label: "Customer Service" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Information Technology", label: "Information Technology" },
    { value: "Audit", label: "Audit" },
  ];

  const branchOptions = [
    { value: "Main Branch", label: "Main Branch" },
    { value: "North Branch", label: "North Branch" },
    { value: "South Branch", label: "South Branch" },
    { value: "East Branch", label: "East Branch" },
    { value: "West Branch", label: "West Branch" },
  ];

  const employmentTypeOptions = [
    { value: "Full-Time", label: "Full-Time" },
    { value: "Part-Time", label: "Part-Time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
  ];

  const accountTypeOptions = [
    { value: "savings", label: "Savings Account" },
    { value: "current", label: "Current Account" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "On Leave", label: "On Leave" },
    { value: "Inactive", label: "Inactive" },
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
      if (!formData?.email?.trim()) newErrors.email = "Email is required";
    }

    if (step === 2) {
      if (!formData?.addressLine1?.trim())
        newErrors.addressLine1 = "Address is required";
      if (!formData?.city?.trim()) newErrors.city = "City is required";
      if (!formData?.state?.trim()) newErrors.state = "State is required";
      if (!formData?.pincode?.trim()) newErrors.pincode = "Pincode is required";
    }

    if (step === 3) {
      if (!formData?.role) newErrors.role = "Role is required";
      if (!formData?.department)
        newErrors.department = "Department is required";
      if (!formData?.branch) newErrors.branch = "Branch is required";
      if (!formData?.employmentType)
        newErrors.employmentType = "Employment type is required";
    }

    if (step === 4) {
      if (!formData?.bankName?.trim())
        newErrors.bankName = "Bank name is required";
      if (!formData?.accountNumber?.trim())
        newErrors.accountNumber = "Account number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
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
              Edit Staff Member
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update staff information
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
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setCurrentStep(step?.number)}
                >
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
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                value={formData?.email}
                onChange={(e) => handleInputChange("email", e?.target?.value)}
                error={errors?.email}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter phone number"
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
            </div>
          )}

          {/* Step 3: Employment Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Role"
                  placeholder="Select role"
                  options={roleOptions}
                  value={formData?.role}
                  onChange={(value) => handleInputChange("role", value)}
                  error={errors?.role}
                  required
                />
                <Select
                  label="Department"
                  placeholder="Select department"
                  options={departmentOptions}
                  value={formData?.department}
                  onChange={(value) => handleInputChange("department", value)}
                  error={errors?.department}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Branch"
                  placeholder="Select branch"
                  options={branchOptions}
                  value={formData?.branch}
                  onChange={(value) => handleInputChange("branch", value)}
                  error={errors?.branch}
                  required
                />
                <Select
                  label="Employment Type"
                  placeholder="Select employment type"
                  options={employmentTypeOptions}
                  value={formData?.employmentType}
                  onChange={(value) =>
                    handleInputChange("employmentType", value)
                  }
                  error={errors?.employmentType}
                  required
                />
              </div>
              <Select
                label="Status"
                placeholder="Select status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange("status", value)}
              />
            </div>
          )}

          {/* Step 4: Bank Details */}
          {currentStep === 4 && (
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
                />
              </div>
              <Select
                label="Account Type"
                placeholder="Select account type"
                options={accountTypeOptions}
                value={formData?.accountType}
                onChange={(value) => handleInputChange("accountType", value)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 md:p-6 bg-muted/30 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>

          <div className="flex-1 text-center text-sm text-muted-foreground">
            Step {currentStep} of {steps?.length}
          </div>

          {currentStep === steps?.length ? (
            <Button
              variant="default"
              onClick={handleSubmit}
              iconName="Check"
              iconPosition="left"
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={handleNext}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditStaffModal;
