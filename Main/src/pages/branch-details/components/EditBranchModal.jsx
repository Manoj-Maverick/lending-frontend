import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const EditBranchModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  const branchTypeOptions = [
    { value: "main", label: "Main Branch" },
    { value: "sub", label: "Sub Branch" },
    { value: "collection", label: "Collection Center" },
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

  const validate = () => {
    const newErrors = {};
    if (!formData?.name?.trim()) newErrors.name = "Branch name is required";
    if (!formData?.code?.trim()) newErrors.code = "Branch code is required";
    if (!formData?.phone?.trim()) newErrors.phone = "Phone number is required";
    if (!formData?.email?.trim()) newErrors.email = "Email is required";
    if (!formData?.address?.trim()) newErrors.address = "Address is required";
    if (!formData?.city?.trim()) newErrors.city = "City is required";
    if (!formData?.state?.trim()) newErrors.state = "State is required";
    if (!formData?.zipCode?.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData?.branchType) newErrors.branchType = "Branch type is required";
    if (!formData?.managerId) newErrors.managerId = "Manager is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-elevation-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Edit Branch</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted transition-colors duration-250 flex items-center justify-center"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-160px)] space-y-4">
          <Input
            label="Branch Name"
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
            required
          />
          <Input
            label="Branch Code"
            value={formData.code || ""}
            onChange={(e) => handleInputChange("code", e.target.value)}
            error={errors.code}
            required
          />
          <Input
            label="Phone Number"
            value={formData.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            error={errors.phone}
            required
          />
          <Input
            label="Email Address"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            required
          />
          <Input
            label="Street Address"
            value={formData.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            error={errors.address}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              value={formData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              error={errors.city}
              required
            />
            <Input
              label="State"
              value={formData.state || ""}
              onChange={(e) => handleInputChange("state", e.target.value)}
              error={errors.state}
              required
            />
          </div>
          <Input
            label="ZIP Code"
            value={formData.zipCode || ""}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
            error={errors.zipCode}
            required
          />
          <Select
            label="Branch Type"
            options={branchTypeOptions}
            value={formData.branchType || ""}
            onChange={(value) => handleInputChange("branchType", value)}
            error={errors.branchType}
            required
          />
          <Select
            label="Branch Manager"
            options={managerOptions}
            value={formData.managerId || ""}
            onChange={(value) => handleInputChange("managerId", value)}
            error={errors.managerId}
            searchable
            required
          />
          <Select
            label="Staff Members"
            options={staffOptions}
            value={Array.isArray(formData.staffIds) ? formData.staffIds : []}
            onChange={(value) => handleInputChange("staffIds", value)}
            multiple
            searchable
            clearable
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end">
          <Button
            className="mr-3"
            variant="outline"
            onClick={onClose}
            iconName="X"
            iconPosition="left"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            iconName="Save"
            iconPosition="left"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditBranchModal;
