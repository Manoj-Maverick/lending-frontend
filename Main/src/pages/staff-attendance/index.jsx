import React, { useMemo, useState } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import PageShell from "components/ui/PageShell";
import AnimatedSection from "components/ui/AnimatedSection";
import {
  useGetStaffList,
  useSaveStaffAttendance,
  useStaffAttendance,
} from "hooks/staff/useStaffList";
import { useUIContext } from "context/UIContext";

const ATTENDANCE_OPTIONS = [
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "LEAVE", label: "Leave" },
  { value: "HALF_DAY", label: "Half Day" },
];

const StaffAttendance = () => {
  const { showToast } = useUIContext();
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [entry, setEntry] = useState({
    attendanceDate: new Date().toISOString().slice(0, 10),
    checkInTime: "",
    checkOutTime: "",
    status: "PRESENT",
    notes: "",
  });

  const { data: staffListResponse } = useGetStaffList({
    page: 1,
    pageSize: 200,
    search: "",
    branch: "all",
    role: "all",
  });

  const staffOptions = useMemo(
    () =>
      (staffListResponse?.data || []).map((member) => ({
        value: member.id,
        label: `${member.name} • ${member.branch || "Unassigned"}`,
      })),
    [staffListResponse],
  );

  const { data: attendanceResponse, isLoading } = useStaffAttendance(
    selectedStaffId,
    selectedMonth,
    Boolean(selectedStaffId),
  );
  const saveAttendanceMutation = useSaveStaffAttendance();
  const records = attendanceResponse?.data || [];

  const handleSave = async () => {
    if (!selectedStaffId) {
      showToast?.("Select a staff member first", "error");
      return;
    }

    try {
      await saveAttendanceMutation.mutateAsync({
        id: Number(selectedStaffId),
        ...entry,
        checkInTime: entry.checkInTime || null,
        checkOutTime: entry.checkOutTime || null,
      });
      showToast?.("Attendance saved successfully", "success");
    } catch (error) {
      showToast?.(error?.message || "Failed to save attendance", "error");
    }
  };

  return (
    <PageShell className="pb-4">
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Icon name="CalendarDays" size={14} />
          Daily Tracking
        </div>
        <h1 className="flex items-center gap-3 text-3xl font-semibold text-foreground md:text-4xl">
          <Icon name="CalendarDays" size={32} className="text-primary" />
          Staff Attendance
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Mark daily attendance, review monthly records, and track absences or
          leave.
        </p>
      </div>

      <AnimatedSection
        className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3"
        delay={80}
      >
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm xl:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Staff Member"
              options={staffOptions}
              value={selectedStaffId}
              onChange={setSelectedStaffId}
              searchable
              placeholder="Select staff"
            />
            <Input
              label="Attendance Month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Records This Month
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {records.length}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Present: {records.filter((item) => item.status === "PRESENT").length}{" "}
            | Absent: {records.filter((item) => item.status === "ABSENT").length}
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm"
        delay={120}
      >
        <div className="mb-4 flex items-center gap-2">
          <Icon name="ClipboardCheck" size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Mark Attendance
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Input
            label="Date"
            type="date"
            value={entry.attendanceDate}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, attendanceDate: e.target.value }))
            }
          />
          <Select
            label="Status"
            options={ATTENDANCE_OPTIONS}
            value={entry.status}
            onChange={(value) => setEntry((prev) => ({ ...prev, status: value }))}
          />
          <Input
            label="Check In"
            type="datetime-local"
            value={entry.checkInTime}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, checkInTime: e.target.value }))
            }
          />
          <Input
            label="Check Out"
            type="datetime-local"
            value={entry.checkOutTime}
            onChange={(e) =>
              setEntry((prev) => ({ ...prev, checkOutTime: e.target.value }))
            }
          />
          <Input
            label="Notes"
            value={entry.notes}
            onChange={(e) => setEntry((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Optional remarks"
          />
        </div>
        <div className="mt-4">
          <Button onClick={handleSave} loading={saveAttendanceMutation.isPending}>
            Save Attendance
          </Button>
        </div>
      </AnimatedSection>

      <AnimatedSection
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
        delay={180}
      >
        <div className="border-b border-border p-4 md:p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Attendance History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                {["Date", "Status", "Check In", "Check Out", "Notes"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Loading attendance...
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {record.attendanceDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {record.status}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {record.checkInTime || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {record.checkOutTime || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {record.notes || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Select a staff member to view attendance records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AnimatedSection>
    </PageShell>
  );
};

export default StaffAttendance;
