import React from "react";
import Input from "components/ui/Input";
import Select from "components/ui/Select";
import DocumentCaptureField from "components/ui/DocumentCaptureField";
import PhoneVerification from "auth/PhoneVerification";

const GuarantorFieldsSection = ({
  formData,
  errors = {},
  onChange,
  relationOptions = [],
  addressMode = "cityState",
  areaOptions = [],
  showPhoneVerification = false,
  guarantorPhoneVerified = false,
  onGuarantorPhoneVerified,
  showDocuments = false,
}) => {
  return (
    <div className="space-y-6">
      <Input
        label="Guarantor Full Name"
        value={formData.guarantorFullName}
        onChange={(e) => onChange("guarantorFullName", e.target.value)}
        required
        error={errors.guarantorFullName}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Input
            label="Phone Number"
            type="tel"
            disabled={showPhoneVerification && guarantorPhoneVerified}
            value={formData.guarantorPhone}
            onChange={(e) => onChange("guarantorPhone", e.target.value)}
            required
            error={showPhoneVerification && guarantorPhoneVerified ? "" : errors.guarantorPhone}
          />
          {showPhoneVerification ? (
            <PhoneVerification
              phone={formData.guarantorPhone}
              verified={guarantorPhoneVerified}
              onVerified={onGuarantorPhoneVerified}
            />
          ) : null}
        </div>

        <Select
          label="Relation"
          options={relationOptions}
          value={formData.guarantorRelation}
          onChange={(value) => onChange("guarantorRelation", value)}
          required
          error={errors.guarantorRelation}
        />
      </div>

      <Input
        label="Address"
        value={formData.guarantorAddress}
        onChange={(e) => onChange("guarantorAddress", e.target.value)}
      />

      {addressMode === "areaDistrict" ? (
        <>
          <Input
            label="Pincode"
            value={formData.guarantorPincode}
            onChange={(e) => onChange("guarantorPincode", e.target.value)}
            maxLength={6}
            error={errors.guarantorPincode}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Select
              label="Area"
              options={areaOptions}
              value={formData.guarantorArea}
              onChange={(value) => onChange("guarantorArea", value)}
              error={errors.guarantorArea}
            />
            <Input
              label="District"
              value={formData.guarantorDistrict}
              onChange={(e) => onChange("guarantorDistrict", e.target.value)}
              error={errors.guarantorDistrict}
            />
            <Input
              label="State"
              value={formData.guarantorState}
              onChange={(e) => onChange("guarantorState", e.target.value)}
              error={errors.guarantorState}
            />
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Input
            label="City"
            value={formData.guarantorCity}
            onChange={(e) => onChange("guarantorCity", e.target.value)}
          />
          <Input
            label="State"
            value={formData.guarantorState}
            onChange={(e) => onChange("guarantorState", e.target.value)}
          />
          <Input
            label="Pincode"
            value={formData.guarantorPincode}
            onChange={(e) => onChange("guarantorPincode", e.target.value)}
            maxLength={6}
            error={errors.guarantorPincode}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Occupation"
          value={formData.guarantorOccupation}
          onChange={(e) => onChange("guarantorOccupation", e.target.value)}
        />
        <Input
          label="Monthly Income (₹)"
          type="number"
          value={formData.guarantorMonthlyIncome}
          onChange={(e) => onChange("guarantorMonthlyIncome", e.target.value)}
          error={errors.guarantorMonthlyIncome}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Aadhaar Number"
          value={formData.guarantorAadhaar}
          onChange={(e) => onChange("guarantorAadhaar", e.target.value)}
          maxLength={12}
          error={errors.guarantorAadhaar}
        />
        <Input
          label="PAN Number"
          value={formData.guarantorPan}
          onChange={(e) => onChange("guarantorPan", e.target.value)}
          maxLength={10}
          error={errors.guarantorPan}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Alternate Phone"
          type="tel"
          value={formData.guarantorAlternatePhone}
          onChange={(e) => onChange("guarantorAlternatePhone", e.target.value)}
          error={errors.guarantorAlternatePhone}
        />
        <Input
          label="Email"
          type="email"
          value={formData.guarantorEmail}
          onChange={(e) => onChange("guarantorEmail", e.target.value)}
          error={errors.guarantorEmail}
        />
      </div>

      {showDocuments ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <DocumentCaptureField
            label="Guarantor Photo (optional)"
            accept="image/*"
            value={formData.guarantor_photo}
            onChange={(file) => onChange("guarantor_photo", file)}
          />
          <DocumentCaptureField
            label="Guarantor Aadhar Document (optional)"
            accept=".pdf,image/*"
            value={formData.guarantor_aadhar_doc}
            onChange={(file) => onChange("guarantor_aadhar_doc", file)}
          />
          <DocumentCaptureField
            label="Guarantor PAN Document (optional)"
            accept=".pdf,image/*"
            value={formData.guarantor_pan_doc}
            onChange={(file) => onChange("guarantor_pan_doc", file)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default GuarantorFieldsSection;
