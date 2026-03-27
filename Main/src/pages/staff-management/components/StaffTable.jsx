import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const StaffTable = ({ staff, onSort, sortConfig, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getAvatarUrl = (staffMember) => {
    const id = staffMember?.id;
    const gender =
      staffMember?.gender ?? ["male", "female"][Math.floor(Math.random() * 2)];

    if (!id) return "/images/avatar-placeholder.png";

    const seed = Number(id) % 100 || 1;

    if (gender?.toLowerCase() === "male") {
      return `https://randomuser.me/api/portraits/men/${seed}.jpg`;
    }

    if (gender?.toLowerCase() === "female") {
      return `https://randomuser.me/api/portraits/women/${seed}.jpg`;
    }

    return "/images/avatar-placeholder.png";
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: "bg-success/10 text-success dark:bg-success/20 dark:text-success",
      Inactive: "bg-error/10 text-error dark:bg-error/20 dark:text-error",
    };

    return (
      colors?.[status === true ? "Active" : "Inactive"] || colors?.Inactive
    );
  };

  const getRoleColor = (role) => {
    const colors = {
      STAFF:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      BRANCH_MANAGER:
        "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    };

    return colors?.[role] || colors?.STAFF;
  };

  const getRoleLabel = (role) => {
    const labels = {
      BRANCH_MANAGER: "Branch Manager",
      STAFF: "Staff",
    };

    return labels?.[role] || role;
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return "ChevronsUpDown";
    return sortConfig?.direction === "asc" ? "ChevronUp" : "ChevronDown";
  };

  const displayedStaff = staff ?? [];

  const handleView = (staffMember) => {
    navigate(`/staff-profile/${staffMember?.id}`, {
      state: { staffData: staffMember },
    });
  };

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-gradient-to-r from-slate-50 via-background to-primary/5 p-4 md:p-5 dark:from-background dark:via-background dark:to-primary/10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Team Directory
            </h2>
            <p className="text-sm text-muted-foreground">
              Review staff details, sort important columns, and open profiles or
              edit flows quickly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5">
              <Icon name="ArrowUpDown" size={14} />
              Sort by clicking table headers
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5">
              <Icon name="LayoutGrid" size={14} />
              Responsive card view on mobile
            </span>
          </div>
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-muted/50">
            <tr>
              <th
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted/70"
                onClick={() => onSort("name")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e?.key === "Enter" && onSort("name")}
              >
                <div className="flex items-center gap-2">
                  Staff
                  <Icon name={getSortIcon("name")} size={16} />
                </div>
              </th>
              <th
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted/70"
                onClick={() => onSort("email")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e?.key === "Enter" && onSort("email")}
              >
                <div className="flex items-center gap-2">
                  Contact
                  <Icon name={getSortIcon("email")} size={16} />
                </div>
              </th>
              <th
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted/70"
                onClick={() => onSort("role")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e?.key === "Enter" && onSort("role")}
              >
                <div className="flex items-center gap-2">
                  Role
                  <Icon name={getSortIcon("role")} size={16} />
                </div>
              </th>
              <th
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted/70"
                onClick={() => onSort("branch")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e?.key === "Enter" && onSort("branch")}
              >
                <div className="flex items-center gap-2">
                  Branch
                  <Icon name={getSortIcon("branch")} size={16} />
                </div>
              </th>
              <th
                className="cursor-pointer px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted/70"
                onClick={() => onSort("status")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e?.key === "Enter" && onSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  <Icon name={getSortIcon("status")} size={16} />
                </div>
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayedStaff?.map((staffMember) => (
              <tr
                key={staffMember?.id}
                className="transition-colors hover:bg-muted/30"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={staffMember?.photo ?? getAvatarUrl(staffMember)}
                      alt={staffMember?.photoAlt}
                      className="h-11 w-11 rounded-2xl object-cover ring-1 ring-border"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {staffMember?.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{staffMember?.code}</span>
                        {staffMember?.designation ? (
                          <>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                            <span className="truncate">
                              {staffMember?.designation}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">
                      {staffMember?.email || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {staffMember?.phone || "No phone number"}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-2">
                    <span
                      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(
                        staffMember?.role,
                      )}`}
                    >
                      {getRoleLabel(staffMember?.role)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Joined {staffMember?.joinDate || "-"}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {staffMember?.branch || "Unassigned"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Branch linked access
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                      staffMember?.status,
                    )}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {staffMember?.status === true ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => handleView(staffMember)}
                      title="View Profile"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onEdit?.(staffMember)}
                      title="Edit Staff"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      className="text-error hover:text-error"
                      onClick={() => onDelete?.(staffMember)}
                      title="Delete Staff"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-border lg:hidden">
        {displayedStaff?.map((staffMember) => (
          <div
            key={staffMember?.id}
            className="p-4 transition-colors hover:bg-muted/20"
          >
            <div className="mb-3 flex gap-4">
              <Image
                src={staffMember?.photo ?? getAvatarUrl(staffMember)}
                alt={staffMember?.photoAlt}
                className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover ring-1 ring-border"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div>
                    <p className="truncate font-semibold text-foreground">
                      {staffMember?.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {staffMember?.code}
                      {staffMember?.designation
                        ? ` • ${staffMember?.designation}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(
                      staffMember?.status,
                    )}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {staffMember?.status === true ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mb-1 truncate text-sm text-muted-foreground">
                  {staffMember?.email || "No email"}
                </p>
                <p className="mb-3 text-xs text-muted-foreground">
                  {staffMember?.phone || "No phone"} •{" "}
                  {staffMember?.branch || "Unassigned branch"}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getRoleColor(
                      staffMember?.role,
                    )}`}
                  >
                    {getRoleLabel(staffMember?.role)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => handleView(staffMember)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onEdit?.(staffMember)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      className="text-error hover:text-error"
                      onClick={() => onDelete?.(staffMember)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayedStaff?.length === 0 && (
        <div className="p-10 text-center md:p-14">
          <Icon
            name="Users"
            size={52}
            className="mx-auto mb-4 text-muted-foreground/40"
          />
          <h3 className="text-lg font-semibold text-foreground">
            No staff members found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try changing the branch or role filter, or add a new staff member
            to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default StaffTable;
