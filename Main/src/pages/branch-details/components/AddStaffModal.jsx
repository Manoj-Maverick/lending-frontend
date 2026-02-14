import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const AddStaffModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    phone: "",
    email: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: "loan-officer", label: "Loan Officer" },
    { value: "collection-agent", label: "Collection Agent" },
    { value: "customer-service", label: "Customer Service" },
    { value: "accountant", label: "Accountant" },
    { value: "field-officer", label: "Field Officer" },
    { value: "branch-manager", label: "Branch Manager" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const validate = () => {
    const newErrors = {};

    if (!formData?.firstName?.trim())
      newErrors.firstName = "First name is required";
    if (!formData?.lastName?.trim())
      newErrors.lastName = "Last name is required";
    if (!formData?.role) newErrors.role = "Staff role is required";
    if (!formData?.phone?.trim()) newErrors.phone = "Phone number is required";
    if (!formData?.email?.trim()) newErrors.email = "Email address is required";

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      role: "",
      phone: "",
      email: "",
      status: "active",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-card border border-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden shadow-elevation-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Add New Staff
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-muted transition-colors duration-250 flex items-center justify-center"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 max-h-[calc(90vh-160px)] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              value={formData?.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              error={errors?.firstName}
              required
            />

            <Input
              label="Last Name"
              placeholder="Enter last name"
              value={formData?.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              error={errors?.lastName}
              required
            />
          </div>

          <Select
            label="Role"
            placeholder="Select staff role"
            options={roleOptions}
            value={formData?.role}
            onChange={(value) => handleChange("role", value)}
            error={errors?.role}
            searchable
            required
          />

          <Input
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            type="tel"
            value={formData?.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors?.phone}
            required
          />

          <Input
            label="Email Address"
            placeholder="email@example.com"
            type="email"
            value={formData?.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors?.email}
            required
          />

          <Select
            label="Status"
            options={statusOptions}
            value={formData?.status}
            onChange={(value) => handleChange("status", value)}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            iconName="X"
            iconPosition="left"
            className="mr-3"
          >
            Cancel
          </Button>

          <Button
            variant="default"
            onClick={handleSubmit}
            iconName="Plus"
            iconPosition="left"
          >
            Add Staff
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;
