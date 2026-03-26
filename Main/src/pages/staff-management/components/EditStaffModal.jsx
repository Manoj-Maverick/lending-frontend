import React, { useEffect, useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useUIContext } from "context/UIContext";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "BRANCH_MANAGER", label: "Branch Manager" },
  { value: "STAFF", label: "Staff" },
];

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const ACCOUNT_TYPE_OPTIONS = [
  { value: "SAVINGS", label: "Savings" },
  { value: "CURRENT", label: "Current" },
  { value: "SALARY", label: "Salary" },
];

const STATUS_OPTIONS = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

const EMPTY_FORM = {
  id: null,
  username: "",
  password: "",
  fullName: "",
  phone: "",
  alternatePhone: "",
  email: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  bloodGroup: "",
  fatherName: "",
  motherName: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  aadhaarNumber: "",
  panNumber: "",
  education: "",
  experienceYears: "",
  designation: "",
  role: "STAFF",
  branchId: "",
  joinDate: "",
  salary: "",
  bankName: "",
  accountHolderName: "",
  bankAccountNumber: "",
  ifscCode: "",
  accountType: "",
  notes: "",
  isActive: true,
};

const EditStaffModal = ({
  isOpen,
  onClose,
  onSubmit,
  staffData,
  isSubmitting = false,
}) => {
  const { branches } = useUIContext();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const branchOptions = useMemo(
    () =>
      (branches || []).map((branch) => ({
        value: branch?.id,
        label: branch?.branch_name,
      })),
    [branches],
  );

  useEffect(() => {
    if (isOpen && staffData) {
      setFormData({
        id: staffData.id,
        username: staffData.username || "",
        password: "",
        fullName: staffData.name || staffData.fullName || "",
        phone: staffData.phone || "",
        alternatePhone: staffData.alternatePhone || "",
        email: staffData.email || "",
        dateOfBirth: staffData.dateOfBirth ? String(staffData.dateOfBirth).slice(0, 10) : "",
        gender: staffData.gender || "",
        maritalStatus: staffData.maritalStatus || "",
        bloodGroup: staffData.bloodGroup || "",
        fatherName: staffData.fatherName || "",
        motherName: staffData.motherName || "",
        emergencyContactName: staffData.emergencyContactName || "",
        emergencyContactPhone: staffData.emergencyContactPhone || "",
        emergencyContactRelationship: staffData.emergencyContactRelationship || "",
        address: staffData.address || "",
        city: staffData.city || "",
        state: staffData.state || "",
        pincode: staffData.pincode || "",
        aadhaarNumber: staffData.aadhaarNumber || "",
        panNumber: staffData.panNumber || "",
        education: staffData.education || "",
        experienceYears:
          staffData.experienceYears == null ? "" : String(staffData.experienceYears),
        designation: staffData.designation || "",
        role: staffData.role || "STAFF",
        branchId: staffData.branchId ?? "",
        joinDate: staffData.joinDate ? String(staffData.joinDate).slice(0, 10) : "",
        salary: staffData.salary == null ? "" : String(staffData.salary),
        bankName: staffData.bankName || "",
        accountHolderName: staffData.accountHolderName || "",
        bankAccountNumber: staffData.bankAccountNumber || "",
        ifscCode: staffData.ifscCode || "",
        accountType: staffData.accountType || "",
        notes: staffData.notes || "",
        isActive: Boolean(staffData.status),
      });
      setErrors({});
    }

    if (!isOpen) {
      setFormData(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen, staffData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "role" && value === "ADMIN") {
        next.branchId = "";
      }

      return next;
    });

    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.username.trim()) nextErrors.username = "Username is required";
    if (formData.password && formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!formData.role) nextErrors.role = "Role is required";
    if (formData.role !== "ADMIN" && !formData.branchId) {
      nextErrors.branchId = "Branch is required";
    }
    if (!formData.joinDate) nextErrors.joinDate = "Join date is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ""))) {
      nextErrors.phone = "Enter a valid phone number";
    }
    if (
      formData.emergencyContactPhone &&
      !/^\d{10,15}$/.test(formData.emergencyContactPhone.replace(/\D/g, ""))
    ) {
      nextErrors.emergencyContactPhone = "Enter a valid emergency contact number";
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode.replace(/\D/g, ""))) {
      nextErrors.pincode = "Enter a valid 6 digit pincode";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      id: formData.id,
      username: formData.username.trim(),
      password: formData.password || undefined,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      alternatePhone: formData.alternatePhone.trim(),
      email: formData.email.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus.trim(),
      bloodGroup: formData.bloodGroup.trim(),
      fatherName: formData.fatherName.trim(),
      motherName: formData.motherName.trim(),
      emergencyContactName: formData.emergencyContactName.trim(),
      emergencyContactPhone: formData.emergencyContactPhone.trim(),
      emergencyContactRelationship: formData.emergencyContactRelationship.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      aadhaarNumber: formData.aadhaarNumber.trim(),
      panNumber: formData.panNumber.trim(),
      education: formData.education.trim(),
      experienceYears: formData.experienceYears,
      designation: formData.designation.trim(),
      role: formData.role,
      branchId: formData.role === "ADMIN" ? null : Number(formData.branchId),
      joinDate: formData.joinDate,
      salary: formData.salary,
      bankName: formData.bankName.trim(),
      accountHolderName: formData.accountHolderName.trim(),
      bankAccountNumber: formData.bankAccountNumber.trim(),
      ifscCode: formData.ifscCode.trim(),
      accountType: formData.accountType,
      notes: formData.notes.trim(),
      isActive: formData.isActive,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevation-lg">
        <div className="flex items-center justify-between border-b border-border p-4 md:p-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground md:text-2xl">
              Edit Full Staff Profile
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update the complete staff record including personal, identity, bank, and work information.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="grid gap-5 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input label="Username" value={formData.username} onChange={(e) => handleInputChange("username", e.target.value)} error={errors.username} required />
            <Input label="New Password" type="password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} error={errors.password} helperText="Leave blank to keep current password." />
            <Select label="Status" options={STATUS_OPTIONS} value={formData.isActive} onChange={(value) => handleInputChange("isActive", value)} />
            <Select label="Role" options={ROLE_OPTIONS} value={formData.role} onChange={(value) => handleInputChange("role", value)} error={errors.role} required />
            <Select label="Branch" options={branchOptions} value={formData.branchId} onChange={(value) => handleInputChange("branchId", value)} searchable disabled={formData.role === "ADMIN"} placeholder={formData.role === "ADMIN" ? "Admin does not need branch" : "Select branch"} error={errors.branchId} required={formData.role !== "ADMIN"} />
            <Input label="Designation" value={formData.designation} onChange={(e) => handleInputChange("designation", e.target.value)} />
            <Input label="Full Name" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} error={errors.fullName} required />
            <Input label="Phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} error={errors.phone} />
            <Input label="Alternate Phone" value={formData.alternatePhone} onChange={(e) => handleInputChange("alternatePhone", e.target.value)} />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} error={errors.email} />
            <Input label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} />
            <Select label="Gender" options={GENDER_OPTIONS} value={formData.gender} onChange={(value) => handleInputChange("gender", value)} />
            <Input label="Marital Status" value={formData.maritalStatus} onChange={(e) => handleInputChange("maritalStatus", e.target.value)} />
            <Input label="Blood Group" value={formData.bloodGroup} onChange={(e) => handleInputChange("bloodGroup", e.target.value)} />
            <Input label="Education" value={formData.education} onChange={(e) => handleInputChange("education", e.target.value)} />
            <Input label="Experience Years" type="number" min="0" step="0.5" value={formData.experienceYears} onChange={(e) => handleInputChange("experienceYears", e.target.value)} />
            <Input label="Father Name" value={formData.fatherName} onChange={(e) => handleInputChange("fatherName", e.target.value)} />
            <Input label="Mother Name" value={formData.motherName} onChange={(e) => handleInputChange("motherName", e.target.value)} />
            <Input label="Emergency Contact Name" value={formData.emergencyContactName} onChange={(e) => handleInputChange("emergencyContactName", e.target.value)} />
            <Input label="Emergency Contact Phone" value={formData.emergencyContactPhone} onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)} error={errors.emergencyContactPhone} />
            <Input label="Relationship" value={formData.emergencyContactRelationship} onChange={(e) => handleInputChange("emergencyContactRelationship", e.target.value)} />
            <div className="md:col-span-3">
              <Input label="Address" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
            </div>
            <Input label="City" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
            <Input label="State" value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)} />
            <Input label="Pincode" value={formData.pincode} onChange={(e) => handleInputChange("pincode", e.target.value)} error={errors.pincode} />
            <Input label="Aadhaar Number" value={formData.aadhaarNumber} onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)} />
            <Input label="PAN Number" value={formData.panNumber} onChange={(e) => handleInputChange("panNumber", e.target.value)} />
            <Input label="Join Date" type="date" value={formData.joinDate} onChange={(e) => handleInputChange("joinDate", e.target.value)} error={errors.joinDate} required />
            <Input label="Salary" type="number" min="0" step="0.01" value={formData.salary} onChange={(e) => handleInputChange("salary", e.target.value)} />
            <Input label="Bank Name" value={formData.bankName} onChange={(e) => handleInputChange("bankName", e.target.value)} />
            <Input label="Account Holder Name" value={formData.accountHolderName} onChange={(e) => handleInputChange("accountHolderName", e.target.value)} />
            <Input label="Bank Account Number" value={formData.bankAccountNumber} onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)} />
            <Input label="IFSC Code" value={formData.ifscCode} onChange={(e) => handleInputChange("ifscCode", e.target.value)} />
            <Select label="Account Type" options={ACCOUNT_TYPE_OPTIONS} value={formData.accountType} onChange={(value) => handleInputChange("accountType", value)} />
            <div className="md:col-span-3">
              <Input label="Notes" value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/30 p-4 md:p-6">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting}>
            Update Staff Member
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditStaffModal;
