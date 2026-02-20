import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Image from "../../../components/AppImage";
import { useFetchBranchStaffListById } from "hooks/branch.details.page.hooks/useGetBranchStaffList";

const hashString = (value = "") => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const getAvatarUrl = (member) => {
  if (member?.avatar) return member.avatar;
  const seed = (hashString(`${member?.id || ""}-${member?.full_name || ""}`) % 70) + 1;
  return `https://i.pravatar.cc/150?img=${seed}`;
};

const StaffManagement = ({ branchId, onAddStaff, onToggleStatus, onRemoveStaff }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useFetchBranchStaffListById(branchId);

  const filteredStaff =
    data?.filter(
      (member) =>
        member?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        member?.role_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
    ) || [];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "BRANCH_MANAGER":
        return "bg-primary/10 text-primary border-primary/20";
      case "STAFF":
        return "bg-accent/10 text-accent border-accent/20";
      case "Collection Agent":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-4 md:p-6 mb-5 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">Staff Management</h2>
        <Button variant="default" iconName="UserPlus" iconPosition="left" onClick={onAddStaff}>
          Add Staff
        </Button>
      </div>

      <div className="mb-4 md:mb-6">
        <div className="relative">
          <Icon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search staff by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading staff...</div>
      ) : (
        <div className="space-y-3">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((member) => (
              <div
                key={member?.id}
                className="bg-background rounded-xl p-3 md:p-4 border border-border hover:shadow-md transition-all"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Image
                      src={getAvatarUrl(member)}
                      alt={member?.full_name}
                      className="w-11 h-11 md:w-12 md:h-12 rounded-full object-cover border border-border"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm md:text-base font-medium text-foreground truncate">
                        {member?.full_name}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                            member?.role_name,
                          )}`}
                        >
                          {member?.role_name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            member?.is_active ? "bg-success/10 text-success" : "bg-error/10 text-error"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {member?.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs md:text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <Icon name="Phone" size={14} />
                      <span>{member?.phone || "-"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Mail" size={14} />
                      <span className="truncate max-w-[220px]">{member?.email || "-"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:ml-auto">
                    <Button
                      variant={member?.is_active ? "outline" : "success"}
                      size="sm"
                      iconName={member?.is_active ? "UserX" : "UserCheck"}
                      onClick={() => onToggleStatus(member?.id)}
                    >
                      {member?.is_active ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      className="text-muted-foreground hover:text-error"
                      onClick={() => onRemoveStaff(member?.id)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 md:py-12">
              <Icon name="Users" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm md:text-base text-muted-foreground">No staff members found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
