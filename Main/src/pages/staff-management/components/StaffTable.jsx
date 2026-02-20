import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const StaffTable = ({
  staff,
  currentPage,
  itemsPerPage,
  onSort,
  sortConfig,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [visibleColumns, setVisibleColumns] = useState({
    photo: true,
    name: true,
    email: true,
    phone: true,
    role: true,
    branch: true,
    status: true,
    actions: true,
  });

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
      "On Leave":
        "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      Inactive: "bg-error/10 text-error dark:bg-error/20 dark:text-error",
    };
    return (
      colors?.[status == true ? "Active" : "Inactive"] || colors?.["Inactive"]
    );
  };

  const getRoleColor = (role) => {
    const colors = {
      ACCOUNTANT:
        "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      STAFF:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      BRANCH_MANAGER:
        "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    };
    return colors?.[role] || colors?.["Loan Officer"];
  };

  const handleSort = (key) => {
    onSort(key);
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return "ChevronsUpDown";
    return sortConfig?.direction === "asc" ? "ChevronUp" : "ChevronDown";
  };

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev?.[column] }));
  };

  const displayedStaff = staff ?? [];

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden mb-6">
      {/* Column Visibility Toggle */}
      <div className="p-3 md:p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 flex-wrap">
          <Icon name="Columns" size={16} className="text-muted-foreground" />
          <span className="text-xs md:text-sm font-medium text-muted-foreground">
            Visible Columns:
          </span>
          {Object.entries(visibleColumns)?.map(([key, value]) => (
            <button
              key={key}
              onClick={() => toggleColumn(key)}
              className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm transition-colors ${
                value
                  ? "bg-accent/15 text-accent"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              aria-pressed={value}
            >
              {key?.charAt(0)?.toUpperCase() +
                key?.slice(1)?.replace(/([A-Z])/g, " $1")}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0 z-10">
            <tr>
              {visibleColumns?.photo && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Photo
                </th>
              )}
              {visibleColumns?.name && (
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("name")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e?.key === "Enter" && handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <Icon name={getSortIcon("name")} size={16} />
                  </div>
                </th>
              )}
              {visibleColumns?.email && (
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("email")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e?.key === "Enter" && handleSort("email")}
                >
                  <div className="flex items-center gap-2">
                    Email
                    <Icon name={getSortIcon("email")} size={16} />
                  </div>
                </th>
              )}
              {visibleColumns?.phone && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Phone
                </th>
              )}
              {visibleColumns?.role && (
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("role")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e?.key === "Enter" && handleSort("role")}
                >
                  <div className="flex items-center gap-2">
                    Role
                    <Icon name={getSortIcon("role")} size={16} />
                  </div>
                </th>
              )}
              {visibleColumns?.branch && (
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("branch")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e?.key === "Enter" && handleSort("branch")}
                >
                  <div className="flex items-center gap-2">
                    Branch
                    <Icon name={getSortIcon("branch")} size={16} />
                  </div>
                </th>
              )}
              {visibleColumns?.status && (
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("status")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e?.key === "Enter" && handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <Icon name={getSortIcon("status")} size={16} />
                  </div>
                </th>
              )}
              {visibleColumns?.actions && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayedStaff?.map((staffMember) => (
              <tr
                key={staffMember?.id}
                className="hover:bg-muted/40 transition-colors"
              >
                {visibleColumns?.photo && (
                  <td className="px-4 py-3">
                    <Image
                      src={staffMember?.photo ?? getAvatarUrl(staffMember)}
                      alt={staffMember?.photoAlt}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </td>
                )}
                {visibleColumns?.name && (
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-foreground">
                        {staffMember?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {staffMember?.code}
                      </p>
                    </div>
                  </td>
                )}
                {visibleColumns?.email && (
                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground">
                      {staffMember?.email}
                    </p>
                  </td>
                )}
                {visibleColumns?.phone && (
                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground">
                      {staffMember?.phone}
                    </p>
                  </td>
                )}
                {visibleColumns?.role && (
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${getRoleColor(
                        staffMember?.role,
                      )}`}
                    >
                      {staffMember?.role}
                    </span>
                  </td>
                )}
                {visibleColumns?.branch && (
                  <td className="px-4 py-3">
                    <p className="text-sm text-foreground">
                      {staffMember?.branch}
                    </p>
                  </td>
                )}
                {visibleColumns?.status && (
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                        staffMember?.status,
                      )}`}
                    >
                      {staffMember?.status === true ? "Active" : "Inactive"}
                    </span>
                  </td>
                )}
                {visibleColumns?.actions && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() =>
                          navigate("/staff-profile", {
                            state: { staffData: staffMember },
                          })
                        }
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
                        onClick={() => onDelete?.(staffMember?.id)}
                        title="Delete Staff"
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden divide-y divide-border">
        {displayedStaff?.map((staffMember) => (
          <div
            key={staffMember?.id}
            className="p-4 hover:bg-muted/40 transition-colors"
          >
            <div className="flex gap-4 mb-3">
              <Image
                src={staffMember?.photo ?? getAvatarUrl(staffMember)}
                alt={staffMember?.photoAlt}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="font-medium text-foreground truncate">
                      {staffMember?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {staffMember?.code}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getStatusColor(
                      staffMember?.status,
                    )}`}
                  >
                    {staffMember?.status === true ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mb-2">
                  {staffMember?.email}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRoleColor(
                        staffMember?.role,
                      )}`}
                    >
                      {staffMember?.role}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {staffMember?.branch}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() =>
                        navigate("/staff-profile", {
                          state: { staffData: staffMember },
                        })
                      }
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
                      onClick={() => onDelete?.(staffMember?.id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayedStaff?.length === 0 && (
        <div className="p-8 md:p-12 text-center">
          <Icon
            name="Users"
            size={48}
            className="mx-auto text-muted-foreground/50 mb-4"
          />
          <p className="text-muted-foreground">No staff members found</p>
        </div>
      )}
    </div>
  );
};

export default StaffTable;
