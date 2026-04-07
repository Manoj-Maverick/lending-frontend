import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const StaffAttendanceSnapshotCard = ({
  selectedMonth,
  onMonthChange,
  onMarkPresent,
  isSaving = false,
  summary,
  attendance = [],
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Attendance Snapshot
        </h2>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange?.(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Button variant="outline" onClick={onMarkPresent} loading={isSaving}>
            Mark Today Present
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 border-b border-border p-4 md:grid-cols-3 md:p-5">
        {[
          { label: "Present", value: summary?.present ?? 0, icon: "UserCheck" },
          { label: "Absent", value: summary?.absent ?? 0, icon: "UserX" },
          { label: "Leave", value: summary?.leave ?? 0, icon: "Plane" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-background p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name={item.icon} size={16} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
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
    </div>
  );
};

export default StaffAttendanceSnapshotCard;
