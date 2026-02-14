import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Image from "../../../components/AppImage";
import { useFetchBranchStaffListById } from "hooks/branch.deatils.page.hooks/useGetBranchStaffList";
const StaffManagement = ({
  branchId,
  staff,
  onAddStaff,
  onToggleStatus,
  onRemoveStaff,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useFetchBranchStaffListById(branchId);
  const filteredStaff = data?.filter(
    (member) =>
      member?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      member?.role_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
  );

  console.log("staffdb", data);
  console.log("staff", filteredStaff);

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
    <div className="bg-card rounded-lg shadow-elevation-sm p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
          Staff Management
        </h2>
        <Button
          variant="default"
          iconName="UserPlus"
          iconPosition="left"
          onClick={onAddStaff}
        >
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
            className="w-full pl-10 pr-4 py-2 md:py-3 bg-background border border-border rounded-lg text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        {filteredStaff?.length > 0 ? (
          filteredStaff?.map((member) => (
            <div
              key={member?.id}
              className="bg-background rounded-lg p-4 md:p-5 border border-border hover:shadow-elevation-md transition-smooth"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                    <Image
                      src={
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWmR-ktRFjwUS7VMedORayia9Ss14By6k3Mg&s"
                      }
                      alt={member?.avatarAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-medium text-foreground mb-1 line-clamp-1">
                      {member?.full_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getRoleBadgeColor(member?.role_name)}`}
                      >
                        {member?.role_name}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                          member?.is_active
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {member?.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex flex-col gap-1 text-xs md:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Phone" size={14} />
                      <span className="whitespace-nowrap">{member?.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Mail" size={14} />
                      <span className="truncate max-w-[180px] sm:max-w-none">
                        {member?.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-2 sm:mt-0">
                    <Button
                      variant={
                        member?.status === "Active" ? "outline" : "success"
                      }
                      size="sm"
                      iconName={
                        member?.status === "Active" ? "UserX" : "UserCheck"
                      }
                      onClick={() => onToggleStatus(member?.id)}
                      className="transition-all duration-200"
                    >
                      {member?.status === "Active" ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Trash2"
                      className="text-muted-foreground hover:text-error transition-all duration-200"
                      onClick={() => onRemoveStaff(member?.id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 md:py-12">
            <Icon
              name="Users"
              size={48}
              className="mx-auto mb-4 text-muted-foreground opacity-50"
            />
            <p className="text-sm md:text-base text-muted-foreground">
              No staff members found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
