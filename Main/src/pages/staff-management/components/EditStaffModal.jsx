import React, { useEffect, useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import DocumentCaptureField from "../../../components/ui/DocumentCaptureField";
import { useUIContext } from "context/UIContext";
import { useAuth } from "auth/AuthContext";
import pincodeLookup from "../../../DataSet/tamil_nadu_pincode_lookup.json";

const ROLE_OPTIONS = [
  { value: "BRANCH_MANAGER", label: "Branch Manager" },
  { value: "STAFF", label: "Staff" },
];

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const MARITAL_STATUS_OPTIONS = [
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" },
];

const BLOOD_GROUP_OPTIONS = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const EDUCATION_OPTIONS = [
  { value: "10TH", label: "10th" },
  { value: "12TH", label: "12th" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "UG", label: "Undergraduate" },
  { value: "PG", label: "Postgraduate" },
  { value: "MBA", label: "MBA" },
  { value: "OTHER", label: "Other" },
];

const DESIGNATION_OPTIONS = [
  { value: "FIELD_OFFICER", label: "Field Officer" },
  { value: "CASHIER", label: "Cashier" },
  { value: "COLLECTION_EXECUTIVE", label: "Collection Executive" },
  { value: "CUSTOMER_RELATIONSHIP_EXECUTIVE", label: "Customer Relationship Executive" },
  { value: "OPERATIONS_EXECUTIVE", label: "Operations Executive" },
  { value: "ACCOUNTANT", label: "Accountant" },
  { value: "BRANCH_MANAGER", label: "Branch Manager" },
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

const RELATIONSHIP_OPTIONS = [
  { value: "FATHER", label: "Father" },
  { value: "MOTHER", label: "Mother" },
  { value: "SPOUSE", label: "Spouse" },
  { value: "BROTHER", label: "Brother" },
  { value: "SISTER", label: "Sister" },
  { value: "FRIEND", label: "Friend" },
  { value: "OTHER", label: "Other" },
];

const DOCUMENT_FIELDS = [
  { key: "photoDocument", label: "Staff Photo", type: "PHOTO" },
  { key: "aadhaarDocument", label: "Aadhaar Document", type: "AADHAAR" },
  { key: "panDocument", label: "PAN Document", type: "PAN" },
  { key: "addressProofDocument", label: "Address Proof", type: "ADDRESS_PROOF" },
  { key: "bankProofDocument", label: "Bank Proof / Passbook", type: "BANK_PROOF" },
  { key: "educationProofDocument", label: "Education Proof", type: "EDUCATION_PROOF" },
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
  state: "Tamil Nadu",
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
  photoDocument: null,
  aadhaarDocument: null,
  panDocument: null,
  addressProofDocument: null,
  bankProofDocument: null,
  educationProofDocument: null,
};

const EditStaffModal = ({
  isOpen,
  onClose,
  onSubmit,
  staffData,
  isSubmitting = false,
}) => {
  const { user } = useAuth();
  const { branches } = useUIContext();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [areaOptions, setAreaOptions] = useState([]);

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
        state: staffData.state || "Tamil Nadu",
        pincode: staffData.pincode || "",
        aadhaarNumber: staffData.aadhaarNumber || "",
        panNumber: staffData.panNumber || "",
        education: staffData.education || "",
        experienceYears: staffData.experienceYears == null ? "" : String(staffData.experienceYears),
        designation: staffData.designation || "",
        role: staffData.role || "STAFF",
        branchId:
          user?.role === "ADMIN"
            ? (staffData.branchId ?? "")
            : (user?.branchId ?? staffData.branchId ?? ""),
        joinDate: staffData.joinDate ? String(staffData.joinDate).slice(0, 10) : "",
        salary: staffData.salary == null ? "" : String(staffData.salary),
        bankName: staffData.bankName || "",
        accountHolderName: staffData.accountHolderName || "",
        bankAccountNumber: staffData.bankAccountNumber || "",
        ifscCode: staffData.ifscCode || "",
        accountType: staffData.accountType || "",
        notes: staffData.notes || "",
        isActive: Boolean(staffData.status),
        photoDocument: null,
        aadhaarDocument: null,
        panDocument: null,
        addressProofDocument: null,
        bankProofDocument: null,
        educationProofDocument: null,
      });
      setErrors({});
    }

    if (!isOpen) {
      setFormData(EMPTY_FORM);
      setErrors({});
      setAreaOptions([]);
    }
  }, [isOpen, staffData, user?.branchId, user?.role]);

  useEffect(() => {
    const pin = formData.pincode;
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setAreaOptions([]);
      return;
    }

    const data = pincodeLookup[pin];
    if (!data || data.length === 0) {
      setAreaOptions([]);
      return;
    }

    const options = data.map((item) => ({
      value: item.area,
      label: `${item.area} (${item.district})`,
    }));
    setAreaOptions(options);
  }, [formData.pincode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

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
    if (!formData.branchId) nextErrors.branchId = "Branch is required";
    if (!formData.joinDate) nextErrors.joinDate = "Join date is required";
    if (!formData.designation) nextErrors.designation = "Designation is required";
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
      maritalStatus: formData.maritalStatus,
      bloodGroup: formData.bloodGroup,
      fatherName: formData.fatherName.trim(),
      motherName: formData.motherName.trim(),
      emergencyContactName: formData.emergencyContactName.trim(),
      emergencyContactPhone: formData.emergencyContactPhone.trim(),
      emergencyContactRelationship: formData.emergencyContactRelationship,
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      aadhaarNumber: formData.aadhaarNumber.trim(),
      panNumber: formData.panNumber.trim(),
      education: formData.education,
      experienceYears: formData.experienceYears,
      designation: formData.designation,
      role: formData.role,
      branchId: Number(formData.branchId),
      joinDate: formData.joinDate,
      salary: formData.salary,
      bankName: formData.bankName.trim(),
      accountHolderName: formData.accountHolderName.trim(),
      bankAccountNumber: formData.bankAccountNumber.trim(),
      ifscCode: formData.ifscCode.trim().toUpperCase(),
      accountType: formData.accountType,
      notes: formData.notes.trim(),
      isActive: formData.isActive,
      staffDocuments: DOCUMENT_FIELDS.map((field) => ({
        documentType: field.type,
        file: formData[field.key],
      })).filter((item) => item.file),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevation-lg">
        <div className="flex items-center justify-between border-b border-border p-4 md:p-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground md:text-2xl">
              Edit Staff Profile
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update the staff record, shift branch assignment, and upload any missing proofs.
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
          <div className="rounded-2xl border border-border bg-background p-4 md:p-5">
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input label="Username" value={formData.username} onChange={(e) => handleInputChange("username", e.target.value)} error={errors.username} required />
              <Input label="New Password" type="password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} error={errors.password} helperText="Leave blank to keep current password." />
              <Select label="Status" options={STATUS_OPTIONS} value={formData.isActive} onChange={(value) => handleInputChange("isActive", value)} />
              <Select label="Role" options={ROLE_OPTIONS} value={formData.role} onChange={(value) => handleInputChange("role", value)} error={errors.role} required />
              {user?.role === "ADMIN" ? (
                <Select label="Branch" options={branchOptions} value={formData.branchId} onChange={(value) => handleInputChange("branchId", value)} searchable error={errors.branchId} required />
              ) : (
                <Input
                  label="Branch"
                  value={
                    branchOptions.find((branch) => branch.value === formData.branchId)?.label ||
                    branchOptions.find((branch) => String(branch.value) === String(formData.branchId))?.label ||
                    ""
                  }
                  disabled
                  readOnly
                />
              )}
              <Select label="Designation" options={DESIGNATION_OPTIONS} value={formData.designation} onChange={(value) => handleInputChange("designation", value)} searchable error={errors.designation} required />
              <Input label="Full Name" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} error={errors.fullName} required />
              <Input label="Phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} error={errors.phone} />
              <Input label="Alternate Phone" value={formData.alternatePhone} onChange={(e) => handleInputChange("alternatePhone", e.target.value)} />
              <Input label="Email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} error={errors.email} />
              <Input label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} />
              <Select label="Gender" options={GENDER_OPTIONS} value={formData.gender} onChange={(value) => handleInputChange("gender", value)} />
              <Select label="Marital Status" options={MARITAL_STATUS_OPTIONS} value={formData.maritalStatus} onChange={(value) => handleInputChange("maritalStatus", value)} />
              <Select label="Blood Group" options={BLOOD_GROUP_OPTIONS} value={formData.bloodGroup} onChange={(value) => handleInputChange("bloodGroup", value)} />
              <Select label="Education" options={EDUCATION_OPTIONS} value={formData.education} onChange={(value) => handleInputChange("education", value)} searchable />
              <Input label="Experience Years" type="number" min="0" step="0.5" value={formData.experienceYears} onChange={(e) => handleInputChange("experienceYears", e.target.value)} />
              <Input label="Father Name" value={formData.fatherName} onChange={(e) => handleInputChange("fatherName", e.target.value)} />
              <Input label="Mother Name" value={formData.motherName} onChange={(e) => handleInputChange("motherName", e.target.value)} />
              <Input label="Emergency Contact Name" value={formData.emergencyContactName} onChange={(e) => handleInputChange("emergencyContactName", e.target.value)} />
              <Input label="Emergency Contact Phone" value={formData.emergencyContactPhone} onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)} error={errors.emergencyContactPhone} />
              <Select label="Relationship" options={RELATIONSHIP_OPTIONS} value={formData.emergencyContactRelationship} onChange={(value) => handleInputChange("emergencyContactRelationship", value)} searchable />
              <div className="md:col-span-3">
                <Input label="Address" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
              </div>
              <Input label="Pincode" value={formData.pincode} onChange={(e) => handleInputChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} error={errors.pincode} />
              <Select label="Area / City" options={areaOptions} value={formData.city} onChange={(value) => handleInputChange("city", value)} searchable placeholder={areaOptions.length ? "Select area" : "Enter pincode first"} />
              <Input label="State" value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)} disabled />
              <Input label="Aadhaar Number" value={formData.aadhaarNumber} onChange={(e) => handleInputChange("aadhaarNumber", e.target.value.replace(/\D/g, "").slice(0, 12))} />
              <Input label="PAN Number" value={formData.panNumber} onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())} />
              <Input label="Join Date" type="date" value={formData.joinDate} onChange={(e) => handleInputChange("joinDate", e.target.value)} error={errors.joinDate} required />
              <Input label="Salary" type="number" min="0" step="0.01" value={formData.salary} onChange={(e) => handleInputChange("salary", e.target.value)} />
              <Input label="Bank Name" value={formData.bankName} onChange={(e) => handleInputChange("bankName", e.target.value)} />
              <Input label="Account Holder Name" value={formData.accountHolderName} onChange={(e) => handleInputChange("accountHolderName", e.target.value)} />
              <Input label="Bank Account Number" value={formData.bankAccountNumber} onChange={(e) => handleInputChange("bankAccountNumber", e.target.value.replace(/\D/g, ""))} />
              <Input label="IFSC Code" value={formData.ifscCode} onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())} />
              <Select label="Account Type" options={ACCOUNT_TYPE_OPTIONS} value={formData.accountType} onChange={(value) => handleInputChange("accountType", value)} />
              <div className="md:col-span-3">
                <Input label="Notes" value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4 md:p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name="FileText" size={18} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <h3 className="text-lg font-semibold text-foreground">Upload Additional Proofs</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {DOCUMENT_FIELDS.map((field) => (
                <DocumentCaptureField
                  key={field.key}
                  label={field.label}
                  value={formData[field.key]}
                  onChange={(file) => handleInputChange(field.key, file)}
                  helperText="Only newly selected files will be uploaded."
                />
              ))}
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
