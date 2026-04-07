import React, { useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useSaveStaffAttendance, useStaffAttendance } from "hooks/staff/useStaffList";
import { useUIContext } from "context/UIContext";
import StaffAttendanceSnapshotCard from "./StaffAttendanceSnapshotCard";

const ATTENDANCE_OPTIONS = [
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "LEAVE", label: "Leave" },
  { value: "HALF_DAY", label: "Half Day" },
];

const StaffAttendancePanel = ({ staff = [] }) => {
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

  const staffOptions = useMemo(
    () =>
      (staff || []).map((member) => ({
        value: String(member.id),
        label: `${member.name} • ${member.branch || "Unassigned"}`,
      })),
    [staff],
  );

  const { data: attendanceResponse, isLoading } = useStaffAttendance(
    selectedStaffId,
    selectedMonth,
    Boolean(selectedStaffId),
  );
  const saveAttendanceMutation = useSaveStaffAttendance();
  const records = attendanceResponse?.data || [];
  const selectedStaff = useMemo(
    () => staff.find((member) => String(member.id) === String(selectedStaffId)),
    [staff, selectedStaffId],
  );
  const presentCount = records.filter((item) => item.status === "PRESENT").length;
  const absentCount = records.filter((item) => item.status === "ABSENT").length;
  const leaveCount = records.filter((item) => item.status === "LEAVE").length;
  const halfDayCount = records.filter((item) => item.status === "HALF_DAY").length;
  const attendanceRate =
    records.length > 0
      ? (((presentCount + halfDayCount * 0.5) / records.length) * 100).toFixed(1)
      : "0.0";

  const statCards = [
    {
      label: "Present Days",
      value: presentCount,
      hint: "Full day attendance entries",
      icon: "UserCheck",
      tone: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Absent Days",
      value: absentCount,
      hint: "Missed work days this month",
      icon: "UserX",
      tone: "bg-rose-500/10 text-rose-600",
    },
    {
      label: "Leave Days",
      value: leaveCount,
      hint: "Approved leave entries",
      icon: "Plane",
      tone: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Half Days",
      value: halfDayCount,
      hint: "Partial attendance records",
      icon: "Clock3",
      tone: "bg-violet-500/10 text-violet-600",
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      hint: "Present and half-day weighted ratio",
      icon: "Gauge",
      tone: "bg-primary/10 text-primary",
    },
  ];

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
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Icon name="CalendarDays" size={14} />
              Attendance Dashboard
            </div>
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
              Track presence, leave, and monthly attendance health
            </h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Review attendance performance for the currently filtered staff set
              and drill into a specific team member when you need to mark or
              audit records.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:w-[420px]">
            <Select
              label="Staff Member"
              options={staffOptions}
              value={selectedStaffId}
              onChange={setSelectedStaffId}
              searchable
              placeholder="Select staff"
              className="relative z-[60]"
            />
            <Input
              label="Attendance Month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  {selectedStaffId ? card.value : "-"}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.tone}`}
              >
                <Icon name={card.icon} size={20} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm xl:col-span-2">
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
              onChange={(value) =>
                setEntry((prev) => ({ ...prev, status: value }))
              }
              className="relative z-[60]"
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
              onChange={(e) =>
                setEntry((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Optional remarks"
            />
          </div>
          <div className="mt-4">
            <Button
              onClick={handleSave}
              loading={saveAttendanceMutation.isPending}
            >
              Save Attendance
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="UserRoundSearch" size={18} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Staff Snapshot
            </h2>
          </div>

          {selectedStaff ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Selected Staff
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {selectedStaff.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedStaff.role} • {selectedStaff.branch || "Unassigned"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Records This Month
                </p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {records.length}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Working Score
                </p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {attendanceRate}%
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-background p-5 text-sm text-muted-foreground">
              Select a staff member from the filtered list to view detailed
              attendance stats and history.
            </div>
          )}
        </div>
      </div>

      {selectedStaffId ? (
        <StaffAttendanceSnapshotCard
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          summary={{
            present: presentCount,
            absent: absentCount,
            leave: leaveCount,
          }}
          attendance={isLoading ? [] : records}
          isSaving={saveAttendanceMutation.isPending}
          onMarkPresent={async () => {
            try {
              await saveAttendanceMutation.mutateAsync({
                id: Number(selectedStaffId),
                attendanceDate: new Date().toISOString().slice(0, 10),
                status: "PRESENT",
              });
              showToast?.("Marked today as present", "success");
            } catch (error) {
              showToast?.(error?.message || "Failed to save attendance", "error");
            }
          }}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Select a staff member to load the detailed attendance snapshot.
        </div>
      )}
    </div>
  );
};

export default StaffAttendancePanel;
