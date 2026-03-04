import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useFetchBranchById } from "hooks/branch.details.page.hooks/useGetSpecificBranch";
import { useUpdateBranch } from "hooks/branch.details.page.hooks/updateBranchDeatils";
import { useToast } from "context/ToastContext";
import { set } from "date-fns";

const EditBranchModal = ({ isOpen, branchId, onClose }) => {
  const { data: branch, isLoading, isPending } = useFetchBranchById(branchId);
  const updateBranchMutation = useUpdateBranch();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    branch_name: "",
    branch_code: "",
    branch_mobile: "",
    email: "",
    address: "",
    location: "",
    state: "",
    branch_type: "",
    manager_id: "",
  });

  const [errors, setErrors] = useState({});

  // Hydrate form when modal opens or data loads
  useEffect(() => {
    if (isOpen && branch) {
      setFormData({
        branch_name: branch.branch_name || "",
        branch_code: branch.branch_code || "",
        branch_mobile: branch.branch_mobile || "",
        email: branch.email || "",
        address: branch.address || "",
        location: branch.location || "",
        state: branch.state || "",
        branch_type: branch.branch_type || "",
        manager_id: branch.manager?.id || "",
      });
    }
  }, [isOpen, branch]);

  const branchTypeOptions = [
    { value: "MAIN", label: "Main Branch" },
    { value: "REGULAR", label: "Sub Branch" },
    { value: "HEAD", label: "Head Office" },
  ];

  // TODO: Replace with real API data
  const managerOptions = [
    { value: 13, label: "Vijay Vijay" },
    { value: 14, label: "Another Manager" },
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.branch_name.trim())
      newErrors.branch_name = "Branch name is required";
    if (!formData.branch_mobile.trim())
      newErrors.branch_mobile = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.branch_type)
      newErrors.branch_type = "Branch type is required";

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
    if (!validate()) return;

    updateBranchMutation.mutate(
      {
        id: branch.id,
        branch_name: formData.branch_name,
        branch_mobile: formData.branch_mobile,
        email: formData.email || null,
        address: formData.address,
        location: formData.location,
        state: formData.state,
        branch_type: formData.branch_type,
        manager_id: formData.manager_id,
      },
      {
        onSuccess: () => {
          showToast("Branch updated successfully", "success");
          setTimeout(() => {
            onClose();
          }, 1000);
        },
        onError: (err) => {
          showToast(
            err?.response?.data?.error || "Failed to update branch",
            "error",
          );
        },
      },
    );
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
        <div className="bg-card p-6 rounded-lg border border-border">
          Loading branch...
        </div>
      </div>
    );
  }

  return (
    <div
      className="form-modal-overlay fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="form-modal-panel bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-elevation-lg"
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
            value={formData.branch_name}
            onChange={(e) => handleInputChange("branch_name", e.target.value)}
            error={errors.branch_name}
            required
          />

          <Input
            label="Branch Code"
            value={formData.branch_code}
            disabled
            helperText="Branch code cannot be changed"
          />

          <Input
            label="Phone Number"
            value={formData.branch_mobile}
            onChange={(e) => handleInputChange("branch_mobile", e.target.value)}
            error={errors.branch_mobile}
            required
          />

          <Input
            label="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
          />

          <Input
            label="Street Address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            error={errors.address}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Location / City"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              error={errors.location}
              required
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              error={errors.state}
              required
            />
          </div>

          <Select
            label="Branch Type"
            options={branchTypeOptions}
            value={formData.branch_type}
            onChange={(value) => handleInputChange("branch_type", value)}
            error={errors.branch_type}
            required
          />

          <Select
            label="Branch Manager"
            options={managerOptions}
            value={formData.manager_id}
            onChange={(value) => handleInputChange("manager_id", value)}
            error={errors.manager_id}
            searchable
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
            disabled={updateBranchMutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            iconName={updateBranchMutation.isPending ? "Loader" : "Check"}
            iconPosition="left"
            disabled={updateBranchMutation.isPending}
          >
            {updateBranchMutation.isPending ? "Updating..." : "Update Branch"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditBranchModal;
