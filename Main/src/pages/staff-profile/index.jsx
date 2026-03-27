import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import PageShell from "components/ui/PageShell";
import AnimatedSection from "components/ui/AnimatedSection";
import EditStaffModal from "../staff-management/components/EditStaffModal";
import DocumentSection from "../borrower-profile/components/DocumentSection";
import { useUIContext } from "context/UIContext";
import {
  useSaveStaffAttendance,
  useStaffAttendance,
  useStaffDetail,
  useUpdateStaff,
} from "hooks/staff/useStaffList";
import { useDeleteDocument } from "hooks/docs/useDeleteDoc";
import { useUploadWithProgress } from "hooks/docs/useUploadWithProgress";

const StaffProfile = () => {
  const navigate = useNavigate();
  const { staffId } = useParams();
  const { showToast } = useUIContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const { data: staffDetailResponse, isLoading } = useStaffDetail(staffId);
  const { data: attendanceResponse } = useStaffAttendance(
    staffId,
    selectedMonth,
    Boolean(staffId),
  );
  const updateStaffMutation = useUpdateStaff();
  const saveAttendanceMutation = useSaveStaffAttendance();
  const deleteDocumentMutation = useDeleteDocument();
  const { uploadDocument } = useUploadWithProgress();

  const staff = staffDetailResponse?.data;
  const attendance = attendanceResponse?.data || [];

  const attendanceSummary = useMemo(
    () => ({
      present: attendance.filter((item) => item.status === "PRESENT").length,
      absent: attendance.filter((item) => item.status === "ABSENT").length,
      leave: attendance.filter((item) => item.status === "LEAVE").length,
    }),
    [attendance],
  );
  if (isLoading || !staff) {
    return (
      <PageShell className="pb-4">
        <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          Loading staff profile...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="pb-4">
      <div className="mb-4">
        <button
          onClick={() => navigate("/staff-management")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon name="ArrowLeft" size={18} />
          Back to Staff Management
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Icon name="BadgeCheck" size={14} />
            Complete Staff Record
          </div>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
            {staff.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {staff.code} • {staff.role} • {staff.branch || "Unassigned"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/staff-attendance")}>
            Attendance Page
          </Button>
          <Button iconName="Edit" iconPosition="left" onClick={() => setIsEditModalOpen(true)}>
            Edit Staff
          </Button>
        </div>
      </div>

      <AnimatedSection className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" delay={80}>
        {[
          { label: "Present Days", value: staff.presentDays || 0, icon: "UserCheck" },
          { label: "Absent Days", value: staff.absentDays || 0, icon: "UserX" },
          { label: "Leave Days", value: staff.leaveDays || 0, icon: "Plane" },
          { label: "Salary", value: staff.salary || 0, icon: "BadgeIndianRupee" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name={item.icon} size={18} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </AnimatedSection>

      <AnimatedSection className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3" delay={120}>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Personal and Employment</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["Username", staff.username],
              ["Phone", staff.phone],
              ["Alternate Phone", staff.alternatePhone],
              ["Email", staff.email],
              ["Date of Birth", staff.dateOfBirth],
              ["Gender", staff.gender],
              ["Marital Status", staff.maritalStatus],
              ["Blood Group", staff.bloodGroup],
              ["Father Name", staff.fatherName],
              ["Mother Name", staff.motherName],
              ["Designation", staff.designation],
              ["Join Date", staff.joinDate],
              ["Education", staff.education],
              ["Experience Years", staff.experienceYears],
              ["Aadhaar Number", staff.aadhaarNumber],
              ["PAN Number", staff.panNumber],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-medium text-foreground">{value || "-"}</p>
              </div>
            ))}
            <div className="md:col-span-2 rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Address</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {[staff.address, staff.city, staff.state, staff.pincode].filter(Boolean).join(", ") || "-"}
              </p>
            </div>
            <div className="md:col-span-2 rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Notes</p>
              <p className="mt-1 text-sm font-medium text-foreground">{staff.notes || "-"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Emergency Contact</h2>
            <div className="space-y-3">
              {[
                ["Name", staff.emergencyContactName],
                ["Phone", staff.emergencyContactPhone],
                ["Relationship", staff.emergencyContactRelationship],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-background px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{value || "-"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Bank Details</h2>
            <div className="space-y-3">
              {[
                ["Bank Name", staff.bankName],
                ["Account Holder", staff.accountHolderName],
                ["Account Number", staff.bankAccountNumber],
                ["IFSC Code", staff.ifscCode],
                ["Account Type", staff.accountType],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-background px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{value || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="rounded-2xl border border-border bg-card shadow-sm" delay={180}>
        <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-5">
          <h2 className="text-lg font-semibold text-foreground">Attendance Snapshot</h2>
          <div className="flex items-center gap-3">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await saveAttendanceMutation.mutateAsync({
                    id: Number(staffId),
                    attendanceDate: new Date().toISOString().slice(0, 10),
                    status: "PRESENT",
                  });
                  showToast?.("Marked today as present", "success");
                } catch (error) {
                  showToast?.(error?.message || "Failed to save attendance", "error");
                }
              }}
              loading={saveAttendanceMutation.isPending}
            >
              Mark Today Present
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 border-b border-border p-4 md:grid-cols-3 md:p-5">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Present</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{attendanceSummary.present}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Absent</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{attendanceSummary.absent}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Leave</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{attendanceSummary.leave}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                {["Date", "Status", "Check In", "Check Out", "Notes"].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attendance.length > 0 ? (
                attendance.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-foreground">{item.attendanceDate}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{item.status}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.checkInTime || "-"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.checkOutTime || "-"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.notes || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No attendance records found for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-6" delay={220}>
        <DocumentSection
          category="staff"
          borrowerId={Number(staffId)}
          onUpload={({ file, document_type, onProgress, signal }) =>
            uploadDocument({
              file,
              category: "staff",
              document_type,
              entity_id: Number(staffId),
              onProgress,
              signal,
            })
          }
          onDelete={(docId) =>
            deleteDocumentMutation.mutateAsync({
              id: docId,
              category: "staff",
              entity_id: Number(staffId),
            })
          }
          verifyPassword={async () => true}
        />
      </AnimatedSection>

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={async (payload) => {
          try {
            const { staffDocuments: newDocuments = [], ...staffPayload } = payload;
            const response = await updateStaffMutation.mutateAsync(staffPayload);
            const employeeId = response?.data?.id || payload.id;

            for (const document of newDocuments) {
              await uploadDocument({
                file: document.file,
                category: "staff",
                document_type: document.documentType,
                entity_id: employeeId,
              });
            }

            setIsEditModalOpen(false);
            showToast?.("Staff member updated successfully", "success");
          } catch (error) {
            showToast?.(error?.message || "Failed to update staff member", "error");
          }
        }}
        staffData={staff}
        isSubmitting={updateStaffMutation.isPending}
      />
    </PageShell>
  );
};

export default StaffProfile;
