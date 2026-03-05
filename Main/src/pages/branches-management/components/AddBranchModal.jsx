import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import DocumentCaptureField from "../../../components/ui/DocumentCaptureField";
import { useCreateBranch } from "hooks/branches/useCreateBranch";
import { useToast } from "context/ToastContext";

const AddBranchModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "Test Branch",
    code: "TB001",
    phone: "9876543210",
    email: "",
    address: "Test Street, Test Area",
    city: "Test City",
    state: "Test State",
    zipCode: "654321",
    branchType: "",
    managerId: "",
    staffIds: [],
    branchPhoto: null,
    registrationDoc: null,
  });
  const { mutate: createBranch, isPending } = useCreateBranch();
  const [errors, setErrors] = useState({});
  const steps = [
    { number: 1, title: "Basic Details", icon: "FileText" },
    { number: 2, title: "Address", icon: "MapPin" },
    { number: 3, title: "Branch Type", icon: "Building2" },
    // { number: 4, title: "Manager", icon: "UserCog" },
    // { number: 5, title: "Staff", icon: "Users" },
  ];

  const branchTypeOptions = [
    { value: "HEAD", label: "Head Branch" },
    { value: "MAIN", label: "Main Branch" },
    { value: "REGULAR", label: "Sub Branch" },
  ];

  const managerOptions = [
    { value: "mgr-001", label: "Sarah Johnson" },
    { value: "mgr-002", label: "Michael Chen" },
    { value: "mgr-003", label: "Emily Rodriguez" },
    { value: "mgr-004", label: "David Kumar" },
  ];

  const staffOptions = [
    { value: "staff-001", label: "John Smith - Loan Officer" },
    { value: "staff-002", label: "Maria Garcia - Collection Agent" },
    { value: "staff-003", label: "Robert Lee - Customer Service" },
    { value: "staff-004", label: "Jennifer Brown - Accountant" },
    { value: "staff-005", label: "William Davis - Field Officer" },
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.name?.trim()) newErrors.name = "Branch name is required";
      if (!formData?.code?.trim()) newErrors.code = "Branch code is required";
      if (!formData?.phone?.trim())
        newErrors.phone = "Phone number is required";
      // if (!formData?.email?.trim()) newErrors.email = "Email is required";
    } else if (step === 2) {
      if (!formData?.address?.trim()) newErrors.address = "Address is required";
      if (!formData?.city?.trim()) newErrors.city = "City is required";
      if (!formData?.state?.trim()) newErrors.state = "State is required";
      if (!formData?.zipCode?.trim())
        newErrors.zipCode = "ZIP code is required";
    } else if (step === 3) {
      if (!formData?.branchType)
        newErrors.branchType = "Branch type is required";
    } else if (step === 4) {
      if (!formData?.managerId)
        newErrors.managerId = "Manager selection is required";
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
    setErrors({});
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    createBranch(
      {
        code: formData.code,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        branchType: formData.branchType,
      },
      {
        onSuccess: () => {
          showToast("Branch created successfully", "success");
          setTimeout(() => {
            handleClose();
          }, 1000);
        },
        onError: (error) => {
          showToast(
            error?.response?.data?.error || "Failed to create branch",
            "error",
          );
        },
      },
    );
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      name: "",
      code: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      branchType: "",
      managerId: "",
      staffIds: [],
      branchPhoto: null,
      registrationDoc: null,
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="form-modal-overlay fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="form-modal-panel bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-elevation-lg"
        onClick={(e) => e?.stopPropagation()}
      >
        <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Add New Branch
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-muted transition-colors duration-250 flex items-center justify-center"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {steps?.map((step, index) => (
              <React.Fragment key={step?.number}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-250 ${
                      currentStep >= step?.number
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step?.number ? (
                      <Icon name="Check" size={20} />
                    ) : (
                      <Icon name={step?.icon} size={20} />
                    )}
                  </div>
                  <span className="text-xs text-center hidden md:block">
                    {step?.title}
                  </span>
                </div>
                {index < steps?.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-colors duration-250 ${
                      currentStep > step?.number ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          <div key={currentStep} className="motion-fade-up">
            {currentStep === 1 && (
              <div className="space-y-4">
                <Input
                  label="Branch Name"
                  type="text"
                  placeholder="Enter branch name"
                  value={formData?.name}
                  onChange={(e) => handleInputChange("name", e?.target?.value)}
                  error={errors?.name}
                  required
                />
                <Input
                  label="Branch Code"
                  type="text"
                  placeholder="Enter unique branch code"
                  value={formData?.code}
                  onChange={(e) => handleInputChange("code", e?.target?.value)}
                  error={errors?.code}
                  required
                />
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
                  label="Email Address (Optional)"
                  type="email"
                  placeholder="Enter email address"
                  value={formData?.email}
                  onChange={(e) => handleInputChange("email", e?.target?.value)}
                  error={errors?.email}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <Input
                  label="Street Address"
                  type="text"
                  placeholder="Enter street address"
                  value={formData?.address}
                  onChange={(e) =>
                    handleInputChange("address", e?.target?.value)
                  }
                  error={errors?.address}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    type="text"
                    placeholder="Enter city"
                    value={formData?.city}
                    onChange={(e) =>
                      handleInputChange("city", e?.target?.value)
                    }
                    error={errors?.city}
                    required
                  />
                  <Input
                    label="State"
                    type="text"
                    placeholder="Enter state"
                    value={formData?.state}
                    onChange={(e) =>
                      handleInputChange("state", e?.target?.value)
                    }
                    error={errors?.state}
                    required
                  />
                </div>
                <Input
                  label="ZIP Code"
                  type="text"
                  placeholder="Enter ZIP code"
                  value={formData?.zipCode}
                  onChange={(e) =>
                    handleInputChange("zipCode", e?.target?.value)
                  }
                  error={errors?.zipCode}
                  required
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <Select
                  label="Branch Type"
                  placeholder="Select branch type"
                  options={branchTypeOptions}
                  value={formData?.branchType}
                  onChange={(value) => handleInputChange("branchType", value)}
                  error={errors?.branchType}
                  required
                />
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Branch Type Information
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon
                        name="Check"
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <span>
                        <strong>Main Branch:</strong> Full service branch with
                        all operations
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon
                        name="Check"
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <span>
                        <strong>Sub Branch:</strong> Smaller branch with limited
                        services
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon
                        name="Check"
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <span>
                        <strong>Collection Center:</strong> Focused on payment
                        collection
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* {currentStep === 4 && (
            <div className="space-y-4">
              <Select
                label="Branch Manager"
                placeholder="Select branch manager"
                options={managerOptions}
                value={formData?.managerId}
                onChange={(value) => handleInputChange("managerId", value)}
                error={errors?.managerId}
                searchable
                required
              />
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Manager Responsibilities
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon
                      name="Check"
                      size={16}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <span>Oversee daily branch operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      name="Check"
                      size={16}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <span>Manage staff and client relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      name="Check"
                      size={16}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <span>Monitor loan portfolio performance</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <Select
                label="Assign Staff Members"
                placeholder="Select staff members"
                options={staffOptions}
                value={formData?.staffIds}
                onChange={(value) => handleInputChange("staffIds", value)}
                multiple
                searchable
                clearable
              />
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Staff Assignment
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  You can assign multiple staff members to this branch. Staff
                  can be added or removed later from the branch details page.
                </p>
                <div className="flex items-center gap-2 text-sm text-accent">
                  <Icon name="Info" size={16} />
                  <span>
                    Selected: {formData?.staffIds?.length} staff member
                    {formData?.staffIds?.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentCaptureField
                  label="Branch Photo (Optional)"
                  accept="image/*"
                  value={formData?.branchPhoto}
                  onChange={(file) => handleInputChange("branchPhoto", file)}
                  helperText="Capture branch storefront/office image or upload."
                />
                <DocumentCaptureField
                  label="Registration/License Doc (Optional)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  value={formData?.registrationDoc}
                  onChange={(file) =>
                    handleInputChange("registrationDoc", file)
                  }
                  helperText="Upload branch compliance document or capture photo."
                />
              </div>
            </div>
          )} */}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? handleClose : handlePrevious}
            iconName={currentStep === 1 ? "X" : "ChevronLeft"}
            iconPosition="left"
          >
            {currentStep === 1 ? "Cancel" : "Previous"}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps?.length}
            </span>
            {currentStep < 3 ? (
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
                variant="default"
                onClick={handleSubmit}
                iconName={isPending ? "Loader" : "Check"}
                iconPosition="left"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Branch"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBranchModal;
