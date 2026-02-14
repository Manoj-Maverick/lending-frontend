import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const AddStaffModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account Details (users table)
    username: "ramesh.staff",
    password: "password123",
    confirmPassword: "password123",
    systemRole: "STAFF",
    systemBranch: "Main Branch",

    // Personal Details
    firstName: "Ramesh",
    lastName: "Kumar",
    dateOfBirth: "1995-06-15",
    gender: "male",
    email: "ramesh.kumar@example.com",
    phone: "9876543210",
    alternatePhone: "9123456789",

    // Address Information
    addressLine1: "12, MG Road",
    addressLine2: "Near Central Park",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",

    // Employment Details
    role: "Loan Officer",
    department: "Operations",
    branch: "Main Branch",
    joinDate: "2024-01-10",
    employmentType: "Full-Time",

    // Bank Details
    bankName: "State Bank of India",
    accountNumber: "123456789012",
    ifscCode: "SBIN0001234",
    accountType: "savings",

    // Documents
    photo: null,
    idProof: null,
    addressProof: null,
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: "Account Details", icon: "Key" },
    { number: 2, title: "Personal Details", icon: "User" },
    { number: 3, title: "Address Information", icon: "MapPin" },
    { number: 4, title: "Employment Details", icon: "Briefcase" },
    { number: 5, title: "Bank Details", icon: "CreditCard" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
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

  const systemRoleOptions = [
    { value: "STAFF", label: "Staff" },
    { value: "MANAGER", label: "Manager" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    // Step 1: Account Details
    if (step === 1) {
      if (!formData.username.trim())
        newErrors.username = "Username is required";

      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirm password is required";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";

      if (!formData.systemRole)
        newErrors.systemRole = "System role is required";

      if (!formData.systemBranch) newErrors.systemBranch = "Branch is required";
    }

    // Step 2: Personal Details
    if (step === 2) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
        newErrors.phone = "Invalid phone number (10 digits required)";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email address";
    }

    // Step 3: Address Information
    if (step === 3) {
      if (!formData.addressLine1.trim())
        newErrors.addressLine1 = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.pincode.replace(/\D/g, "")))
        newErrors.pincode = "Invalid pincode (6 digits required)";
    }

    // Step 4: Employment Details
    if (step === 4) {
      if (!formData.role) newErrors.role = "Role is required";
      if (!formData.department) newErrors.department = "Department is required";
      if (!formData.branch) newErrors.branch = "Branch is required";
      if (!formData.joinDate) newErrors.joinDate = "Join date is required";
      if (!formData.employmentType)
        newErrors.employmentType = "Employment type is required";
    }

    // Step 5: Bank Details
    if (step === 5) {
      if (!formData.bankName.trim())
        newErrors.bankName = "Bank name is required";
      if (!formData.accountNumber.trim())
        newErrors.accountNumber = "Account number is required";
      if (!formData.ifscCode.trim())
        newErrors.ifscCode = "IFSC code is required";
      if (!formData.accountType)
        newErrors.accountType = "Account type is required";
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
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      systemRole: "",
      systemBranch: "",
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
      photo: null,
      idProof: null,
      addressProof: null,
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
              Add New Staff Member
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Complete all steps to create staff profile and account
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
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep === step.number
                        ? "bg-accent text-white"
                        : currentStep > step.number
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step.icon} size={16} />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs font-medium">
                      Step {step.number}
                    </div>
                    <div className="text-xs">{step.title}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-8 md:w-12 ${
                      currentStep > step.number ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Step 1: Account Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Input
                label="Username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                error={errors.username}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  error={errors.password}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  error={errors.confirmPassword}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="System Role"
                  placeholder="Select system role"
                  options={systemRoleOptions}
                  value={formData.systemRole}
                  onChange={(value) => handleInputChange("systemRole", value)}
                  error={errors.systemRole}
                  required
                />
                <Select
                  label="System Branch"
                  placeholder="Select branch"
                  options={branchOptions}
                  value={formData.systemBranch}
                  onChange={(value) => handleInputChange("systemBranch", value)}
                  error={errors.systemBranch}
                  required
                />
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  error={errors.firstName}
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  error={errors.lastName}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  error={errors.dateOfBirth}
                  required
                />
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  options={genderOptions}
                  value={formData.gender}
                  onChange={(value) => handleInputChange("gender", value)}
                  error={errors.gender}
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={errors.phone}
                  required
                />
                <Input
                  label="Alternate Phone"
                  value={formData.alternatePhone}
                  onChange={(e) =>
                    handleInputChange("alternatePhone", e.target.value)
                  }
                />
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-4">
              <Input
                label="Address Line 1"
                value={formData.addressLine1}
                onChange={(e) =>
                  handleInputChange("addressLine1", e.target.value)
                }
                error={errors.addressLine1}
                required
              />
              <Input
                label="Address Line 2"
                value={formData.addressLine2}
                onChange={(e) =>
                  handleInputChange("addressLine2", e.target.value)
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  error={errors.city}
                  required
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  error={errors.state}
                  required
                />
                <Input
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  error={errors.pincode}
                  required
                />
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Role"
                  options={roleOptions}
                  value={formData.role}
                  onChange={(value) => handleInputChange("role", value)}
                  error={errors.role}
                  required
                />
                <Select
                  label="Department"
                  options={departmentOptions}
                  value={formData.department}
                  onChange={(value) => handleInputChange("department", value)}
                  error={errors.department}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Branch"
                  options={branchOptions}
                  value={formData.branch}
                  onChange={(value) => handleInputChange("branch", value)}
                  error={errors.branch}
                  required
                />
                <Select
                  label="Employment Type"
                  options={employmentTypeOptions}
                  value={formData.employmentType}
                  onChange={(value) =>
                    handleInputChange("employmentType", value)
                  }
                  error={errors.employmentType}
                  required
                />
              </div>

              <Input
                label="Join Date"
                type="date"
                value={formData.joinDate}
                onChange={(e) => handleInputChange("joinDate", e.target.value)}
                error={errors.joinDate}
                required
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <Input
                label="Bank Name"
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                error={errors.bankName}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Account Number"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                  error={errors.accountNumber}
                  required
                />
                <Input
                  label="IFSC Code"
                  value={formData.ifscCode}
                  onChange={(e) =>
                    handleInputChange("ifscCode", e.target.value)
                  }
                  error={errors.ifscCode}
                  required
                />
              </div>

              <Select
                label="Account Type"
                options={accountTypeOptions}
                value={formData.accountType}
                onChange={(value) => handleInputChange("accountType", value)}
                error={errors.accountType}
                required
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
            Step {currentStep} of {steps.length}
          </div>

          {currentStep === steps.length ? (
            <Button
              variant="default"
              onClick={handleSubmit}
              iconName="Check"
              iconPosition="left"
            >
              Create Staff
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

export default AddStaffModal;
