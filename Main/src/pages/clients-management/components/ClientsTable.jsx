import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const ClientsTable = ({
  clients,
  currentPage,
  itemsPerPage,
  onSort,
  sortConfig,
  onBlockStatusChange,
}) => {
  const navigate = useNavigate();
  const [visibleColumns, setVisibleColumns] = useState({
    photo: true,
    name: true,
    phone: true,
    code: true,
    branch: true,
    loanStatus: true,
    blockStatus: true,
    actions: true,
  });

  const getStatusColor = (status) => {
    const colors = {
      Active:
        "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      Closed:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      "No Loan":
        "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
      Delayed:
        "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    };
    return colors?.[status] || colors?.["No Loan"];
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedClients = clients?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
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
                    <Icon name={getSortIcon("name")} size={14} />
                  </div>
                </th>
              )}
              {visibleColumns?.phone && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Phone
                </th>
              )}
              {visibleColumns?.code && (
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("code")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e?.key === "Enter" && handleSort("code")}
                >
                  <div className="flex items-center gap-2">
                    Client Code
                    <Icon name={getSortIcon("code")} size={14} />
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
                    <Icon name={getSortIcon("branch")} size={14} />
                  </div>
                </th>
              )}
              {visibleColumns?.loanStatus && (
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSort("loanStatus")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e?.key === "Enter" && handleSort("loanStatus")
                  }
                >
                  <div className="flex items-center gap-2">
                    Loan Status
                    <Icon name={getSortIcon("loanStatus")} size={14} />
                  </div>
                </th>
              )}
              {visibleColumns?.blockStatus && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Block Status
                </th>
              )}
              {visibleColumns?.actions && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayedClients?.map((client, index) => (
              <tr
                key={client?.id}
                className="hover:bg-muted/30 transition-colors"
                role="row"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e?.key === "Enter") {
                    navigate("/client-profile", {
                      state: { clientData: client },
                    });
                  }
                }}
              >
                {visibleColumns?.photo && (
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={client?.photo}
                        alt={client?.photoAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                )}
                {visibleColumns?.name && (
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">
                      {client?.name}
                    </div>
                  </td>
                )}
                {visibleColumns?.phone && (
                  <td className="px-4 py-3">
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {client?.phone}
                    </div>
                  </td>
                )}
                {visibleColumns?.code && (
                  <td className="px-4 py-3">
                    <div className="text-sm font-mono text-foreground">
                      {client?.code}
                    </div>
                  </td>
                )}
                {visibleColumns?.branch && (
                  <td className="px-4 py-3">
                    <div className="text-sm text-muted-foreground">
                      {client?.branch}
                    </div>
                  </td>
                )}
                {visibleColumns?.loanStatus && (
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(client?.loanStatus)}`}
                    >
                      <Icon
                        name={
                          client?.loanStatus === "Active"
                            ? "CircleDot"
                            : client?.loanStatus === "Closed"
                              ? "CheckCircle2"
                              : client?.loanStatus === "Delayed"
                                ? "AlertCircle"
                                : "Circle"
                        }
                        size={12}
                      />
                      {client?.loanStatus}
                    </span>
                  </td>
                )}
                {visibleColumns?.blockStatus && (
                  <td className="px-4 py-3">
                    {client?.isBlocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                        <Icon name="Ban" size={12} />
                        Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <Icon name="CheckCircle2" size={12} />
                        Active
                      </span>
                    )}
                  </td>
                )}
                {visibleColumns?.actions && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() =>
                          navigate("/client-profile", {
                            state: { clientData: client },
                          })
                        }
                        aria-label={`View ${client?.name} profile`}
                      >
                        View
                      </Button>
                      <Button
                        variant={client?.isBlocked ? "default" : "destructive"}
                        size="sm"
                        iconName={client?.isBlocked ? "CheckCircle2" : "Ban"}
                        onClick={() => onBlockStatusChange(client)}
                      >
                        {client?.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile/Tablet Card Layout */}
      <div className="lg:hidden divide-y divide-border">
        {displayedClients?.map((client) => (
          <div
            key={client?.id}
            className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
            onClick={() =>
              navigate("/client-profile", { state: { clientData: client } })
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e?.key === "Enter") {
                navigate("/client-profile", {
                  state: { clientData: client },
                });
              }
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              {visibleColumns?.photo && (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={client?.photo}
                    alt={client?.photoAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {visibleColumns?.name && (
                  <h3 className="font-semibold text-foreground text-base md:text-lg mb-1">
                    {client?.name}
                  </h3>
                )}
                {visibleColumns?.code && (
                  <p className="text-xs md:text-sm text-muted-foreground font-mono">
                    {client?.code}
                  </p>
                )}
              </div>
              {visibleColumns?.loanStatus && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${getStatusColor(client?.loanStatus)}`}
                >
                  <Icon
                    name={
                      client?.loanStatus === "Active"
                        ? "CircleDot"
                        : client?.loanStatus === "Closed"
                          ? "CheckCircle2"
                          : client?.loanStatus === "Delayed"
                            ? "AlertCircle"
                            : "Circle"
                    }
                    size={12}
                  />
                  {client?.loanStatus}
                </span>
              )}
              {visibleColumns?.blockStatus && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
                    client?.isBlocked
                      ? "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                      : "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                  }`}
                >
                  <Icon
                    name={client?.isBlocked ? "Ban" : "CheckCircle2"}
                    size={12}
                  />
                  {client?.isBlocked ? "Blocked" : "Active"}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {visibleColumns?.phone && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Phone</p>
                  <p className="text-sm font-medium text-foreground">
                    {client?.phone}
                  </p>
                </div>
              )}
              {visibleColumns?.branch && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Branch</p>
                  <p className="text-sm font-medium text-foreground">
                    {client?.branch}
                  </p>
                </div>
              )}
            </div>
            {visibleColumns?.actions && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  fullWidth
                  onClick={(e) => {
                    e?.stopPropagation();
                    navigate("/client-profile", {
                      state: { clientId: client?.id },
                    });
                  }}
                >
                  View Profile
                </Button>
                <Button
                  variant={client?.isBlocked ? "default" : "destructive"}
                  size="sm"
                  iconName={client?.isBlocked ? "CheckCircle2" : "Ban"}
                  fullWidth
                  onClick={(e) => {
                    e?.stopPropagation();
                    onBlockStatusChange(client);
                  }}
                >
                  {client?.isBlocked ? "Unblock" : "Block"}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {displayedClients?.length === 0 && (
        <div className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Icon name="Users" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
            No clients found
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientsTable;
