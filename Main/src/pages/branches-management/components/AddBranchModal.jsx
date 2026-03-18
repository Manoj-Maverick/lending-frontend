import React, { useState, useEffect, useRef } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useCreateBranch } from "hooks/branches/useCreateBranch";
import { useToast } from "context/ToastContext";
import { useGenerateBranchCode } from "hooks/generators/useGenerateBranchCode";

import tamilNaduPincodes from "../../../dataSet/tamil_nadu_pincode_lookup.json";

const AddBranchModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const { mutate: generateBranchCode, isPending: isGenerating } =
    useGenerateBranchCode();
  const { mutate: createBranch, isPending: isCreating } = useCreateBranch();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    area: "",
    city: "",
    state: "",
    branchType: "",
    branchPhoto: null,
    registrationDoc: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [areaOptions, setAreaOptions] = useState([]);

  // Prevent duplicate toasts for same invalid pincode
  const lastWarnedPinRef = useRef(null);

  const steps = [
    { number: 1, title: "Basic Details", icon: "FileText" },
    { number: 2, title: "Address", icon: "MapPin" },
    { number: 3, title: "Branch Type & Code", icon: "Building2" },
  ];

  const branchTypeOptions = [
    { value: "HEAD", label: "Head Branch" },
    { value: "MAIN", label: "Main Branch" },
    { value: "REGULAR", label: "Sub Branch" },
  ];

  const FALLBACK_CODE_PREFIX = "TEST-BRN-";

  // ─── VALIDATION RULES ────────────────────────────────────────────────────
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value?.trim()) return "Branch name is required";
        if (value.trim().length < 4)
          return "Branch name must be at least 4 characters";
        return "";

      case "phone":
        if (!value?.trim()) return "Phone number is required";
        if (!/^[6-9]\d{9}$/.test(value.trim())) {
          return "Enter a valid 10-digit Indian mobile number (starts with 6–9)";
        }
        return "";

      case "email":
        if (!value?.trim()) return "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return "Please enter a valid email address";
        }
        return "";

      case "address":
        if (!value?.trim()) return "Street address is required";
        return "";

      case "pincode":
        if (!value?.trim()) return "PIN code is required";
        if (value.length !== 6 || !/^\d{6}$/.test(value)) {
          return "Enter a valid 6-digit PIN code";
        }
        return "";

      case "area":
        if (!value?.trim()) return "Area/locality is required";
        return "";

      case "city":
        if (!value?.trim()) return "City/District is required";
        return "";

      case "state":
        if (!value?.trim()) return "State is required";
        return "";

      case "branchType":
        if (!value) return "Branch type is required";
        return "";

      case "code":
        if (!value?.trim()) return "Branch code is required";
        if (value.startsWith(FALLBACK_CODE_PREFIX)) {
          return "Using temporary test code (generator unavailable)";
        }
        return "";

      default:
        return "";
    }
  };

  // ─── PINCODE LOOKUP ──────────────────────────────────────────────────────
  useEffect(() => {
    const pin = (formData.pincode || "").trim();

    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setAreaOptions([]);
      setFormData((prev) => ({ ...prev, area: "", city: "", state: "" }));
      lastWarnedPinRef.current = null;
      return;
    }

    const entry = tamilNaduPincodes[pin];

    if (!entry || !Array.isArray(entry) || entry.length === 0) {
      if (lastWarnedPinRef.current !== pin) {
        showToast("PIN code not found in Tamil Nadu records", "warning");
        lastWarnedPinRef.current = pin;
      }
      setAreaOptions([]);
      return;
    }

    lastWarnedPinRef.current = null;

    const options = entry.map((item) => ({
      value: item.area,
      label: item.area,
      district: item.district,
    }));

    setAreaOptions(options);

    const first = options[0];
    setFormData((prev) => ({
      ...prev,
      city: prev.city?.trim() ? prev.city : first.district,
      state: prev.state?.trim() ? prev.state : "Tamil Nadu",
      ...(options.length === 1 && !prev.area?.trim()
        ? { area: first.value }
        : {}),
    }));
  }, [formData.pincode, showToast]);

  // ─── BRANCH CODE PREVIEW ─────────────────────────────────────────────────
  useEffect(() => {
    const city = (formData.city || "").trim();
    const branchType = formData.branchType;

    if (!city || !branchType) {
      setFormData((prev) => ({ ...prev, code: "" }));
      return;
    }

    const typeMap = { HEAD: "HD", MAIN: "MN", REGULAR: "RG" };
    const typeCode = typeMap[branchType] || "XX";

    const districtCode = city
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 3)
      .padEnd(3, "X");

    const areaCode = (formData.area || "")
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .replace(/[AEIOU]/g, "")
      .slice(0, 3)
      .padEnd(3, "X");

    const preview = `${typeCode}-${districtCode}${areaCode}###`;

    setFormData((prev) => ({ ...prev, code: preview }));
  }, [formData.city, formData.area, formData.branchType]);

  // ─── VALIDATION ON CHANGE / BLUR ─────────────────────────────────────────
  const validateAndSetError = (field, value) => {
    const errorMsg = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      validateAndSetError(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateAndSetError(field, formData[field]);
  };

  const handleAreaChange = (selectedValue) => {
    const selected = areaOptions.find((opt) => opt.value === selectedValue);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        area: selected.value,
        city: prev.city?.trim() ? prev.city : selected.district,
      }));

      if (touched.area) validateAndSetError("area", selected.value);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 1) {
      ["name", "phone", "email"].forEach((field) => {
        const err = validateField(field, formData[field]);
        if (err) {
          newErrors[field] = err;
          isValid = false;
        }
      });
    }

    if (step === 2) {
      ["address", "pincode", "area", "city", "state"].forEach((field) => {
        const err = validateField(field, formData[field]);
        if (err) {
          newErrors[field] = err;
          isValid = false;
        }
      });
    }

    if (step === 3) {
      ["branchType", "code"].forEach((field) => {
        const err = validateField(field, formData[field]);
        if (err) {
          newErrors[field] = err;
          isValid = false;
        }
      });
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const isStepValid = (step) => {
    if (step === 1) return !errors.name && !errors.phone && !errors.email;
    if (step === 2)
      return (
        !errors.address &&
        !errors.pincode &&
        !errors.area &&
        !errors.city &&
        !errors.state
      );
    if (step === 3) return !errors.branchType && !errors.code;
    return false;
  };

  const handleNext = () => {
    // Mark all fields in current step as touched
    const fieldsToTouch =
      currentStep === 1
        ? ["name", "phone", "email"]
        : currentStep === 2
          ? ["address", "pincode", "area", "city", "state"]
          : ["branchType", "code"];

    fieldsToTouch.forEach((f) =>
      setTouched((prev) => ({ ...prev, [f]: true })),
    );

    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      showToast("Please fix the errors before proceeding", "warning");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep(3)) {
      showToast("Please complete all required fields correctly", "warning");
      return;
    }

    generateBranchCode(
      {
        branchType: formData.branchType,
        district: (formData.city || "").trim(),
        area: (formData.area || "").trim(),
      },
      {
        onSuccess: (realCode) => {
          const finalCode = (realCode || "").trim();
          if (!finalCode) {
            showToast("Branch code generation returned empty value", "error");
            return;
          }

          createBranch(
            {
              code: finalCode,
              name: (formData.name || "").trim(),
              phone: (formData.phone || "").trim(),
              email: formData.email?.trim() || undefined,
              address: (formData.address || "").trim(),
              city: (formData.city || "").trim(),
              state: (formData.state || "").trim(),
              zipCode: (formData.pincode || "").trim(),
              branchType: formData.branchType,
            },
            {
              onSuccess: () => {
                showToast("Branch created successfully!", "success");
                setTimeout(onClose, 1600);
              },
              onError: (err) => {
                showToast(
                  err?.response?.data?.message || "Failed to create branch",
                  "error",
                );
              },
            },
          );
        },
        onError: (err) => {
          showToast(
            err?.response?.data?.message || "Failed to generate branch code",
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
      pincode: "",
      area: "",
      city: "",
      state: "",
      branchType: "",
      branchPhoto: null,
      registrationDoc: null,
    });
    setErrors({});
    setTouched({});
    setAreaOptions([]);
    lastWarnedPinRef.current = null;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add New Branch
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.number
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Icon name="Check" size={18} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs mt-1.5 font-medium text-gray-600 dark:text-gray-300 hidden sm:block">
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-3 rounded ${
                      currentStep > step.number
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-5">
              <Input
                label="Branch Name"
                value={formData.name}
                placeholder={"Branch Name"}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                required
                error={touched.name && errors.name}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder={"Phone Number"}
                value={formData.phone}
                onChange={(e) =>
                  handleInputChange(
                    "phone",
                    e.target.value.replace(/\D/g, "").slice(0, 10),
                  )
                }
                onBlur={() => handleBlur("phone")}
                required
                error={touched.phone && errors.phone}
                maxLength={10}
              />
              <Input
                label="Email Address (optional)"
                type="email"
                placeholder={"email address"}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                error={touched.email && errors.email}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <Input
                label="Street Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                required
                error={touched.address && errors.address}
                placeholder="Building name, street, landmark..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="PIN Code"
                  value={formData.pincode}
                  onChange={(e) =>
                    handleInputChange(
                      "pincode",
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  onBlur={() => handleBlur("pincode")}
                  required
                  error={touched.pincode && errors.pincode}
                  placeholder="600001"
                  maxLength={6}
                  helperText={
                    areaOptions.length > 0
                      ? `${areaOptions.length} area${areaOptions.length > 1 ? "s" : ""} found`
                      : formData.pincode.length === 6
                        ? "No areas found for this PIN"
                        : ""
                  }
                />

                <Select
                  label="Area / Locality"
                  options={areaOptions}
                  value={formData.area}
                  onChange={handleAreaChange}
                  placeholder={
                    areaOptions.length === 0
                      ? "Enter valid PIN code first..."
                      : "Select area..."
                  }
                  disabled={areaOptions.length === 0}
                  required
                  error={touched.area && errors.area}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="City / District"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  onBlur={() => handleBlur("city")}
                  disabled={areaOptions.length > 0 && !!formData.area}
                  required
                  error={touched.city && errors.city}
                  helperText={
                    areaOptions.length > 0 && !formData.city?.trim()
                      ? "Auto-filled from PIN code"
                      : ""
                  }
                />

                <Input
                  label="State"
                  value={formData.state}
                  disabled
                  required
                  error={touched.state && errors.state}
                  helperText="Tamil Nadu (auto-filled)"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Select
                label="Branch Type"
                options={branchTypeOptions}
                value={formData.branchType}
                onChange={(v) => {
                  handleInputChange("branchType", v);
                  if (touched.branchType) validateAndSetError("branchType", v);
                }}
                required
                error={touched.branchType && errors.branchType}
                placeholder="Select branch type..."
              />

              <Input
                label="Branch Code"
                value={formData.code}
                readOnly
                disabled
                placeholder="Will be generated automatically"
                helperText={
                  formData.code?.startsWith(FALLBACK_CODE_PREFIX)
                    ? "Using temporary test code – generator unavailable"
                    : formData.code
                      ? "Auto-generated branch code"
                      : "Code will be generated once type, city & area are filled"
                }
                error={touched.code && errors.code}
              />

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
                Branch code is <strong>automatically generated</strong> when
                branch type, city/district or area changes.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? handleClose : handlePrevious}
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep) || isGenerating}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isCreating || !formData.code?.trim() || !isStepValid(3)}
              loading={isCreating}
            >
              {isCreating ? "Creating Branch..." : "Create Branch"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBranchModal;
