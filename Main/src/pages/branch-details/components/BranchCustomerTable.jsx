import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { useFetchBranchCustomers as useBranchClients } from "../../../hooks/branch.details.page.hooks/useGetBranchCustomers";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "ACTIVE", label: "Active Loans" },
  { value: "No Loans", label: "No Active Loan" },
];

const customerStatusOptions = [
  { value: "all", label: "All Customers" },
  { value: "active", label: "Active Customers" },
  { value: "blocked", label: "Blocked Customers" },
];

const pageSizeOptions = [
  { value: "5", label: "5 per page" },
  { value: "10", label: "10 per page" },
  { value: "25", label: "25 per page" },
];

const hashString = (value = "") => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const getClientAvatar = (client) => {
  if (client?.photo || client?.avatar) return client?.photo || client?.avatar;
  const base = `${client?.id || ""}-${client?.name || ""}`;
  const seed = (hashString(base) % 70) + 1;
  return `https://i.pravatar.cc/150?img=${seed}`;
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const getLoanStatusColor = (status) => {
  const colors = {
    ACTIVE: "bg-blue-500/10 text-blue-600",
    "No Loans": "bg-gray-500/10 text-gray-600",
  };
  return colors[status] || colors["No Loans"];
};

const BranchClients = () => {
  const navigate = useNavigate();
  const { branchId } = useParams();

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    blockStatus: "all",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const onFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "ChevronsUpDown";
    return sortConfig.direction === "asc" ? "ChevronUp" : "ChevronDown";
  };

  const { data, isLoading, isFetching, isError } = useBranchClients({
    branchId,
    search: filters.search,
    status: filters.status,
    sortKey: sortConfig.key === "loanStatus" ? "loan_status" : sortConfig.key,
    sortDir: sortConfig.direction,
    page: currentPage,
    pageSize: itemsPerPage,
  });

  const clients = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const startItem = totalItems === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="space-y-0 mb-5">
      <div className="bg-card border border-border rounded-t-xl rounded-b-none p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon name="Filter" size={18} className="text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Filter Clients</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-accent">{clients.length}</span> of{" "}
            <span className="font-semibold text-foreground">{totalItems}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            type="search"
            placeholder="Search by name, phone, or code..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(v) => onFilterChange("status", v)}
          />
          <Select
            options={customerStatusOptions}
            value={filters.blockStatus}
            onChange={(v) => onFilterChange("blockStatus", v)}
          />
        </div>

        {isFetching && <div className="mt-2 text-xs text-muted-foreground">Updating results...</div>}
      </div>

      <div className="bg-card border-x border-border border-t-0 border-b-0">
        <div className="hidden md:block overflow-x-auto px-2 pb-2">
          <table className="w-full min-w-[840px] border-separate border-spacing-y-2">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Photo
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name <Icon name={getSortIcon("name")} size={14} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Phone
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("code")}
                >
                  <div className="flex items-center gap-2">
                    Code <Icon name={getSortIcon("code")} size={14} />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("loanStatus")}
                >
                  <div className="flex items-center gap-2">
                    Loan Status <Icon name={getSortIcon("loanStatus")} size={14} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Customer Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="bg-background border border-border shadow-sm hover:shadow-md hover:bg-muted/20 transition-all"
                >
                  <td className="px-4 py-3 rounded-l-lg">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted ring-2 ring-background border border-border">
                      <Image src={getClientAvatar(client)} alt={client.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{client.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{getInitials(client.name)} profile</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{client.phone}</td>
                  <td className="px-4 py-3 font-mono text-sm">{client.code}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getLoanStatusColor(
                        client.loanStatus,
                      )}`}
                    >
                      {client.loanStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {client.isBlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-red-600 bg-red-500/10 text-xs font-medium">
                        <Icon name="Ban" size={12} />
                        Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-emerald-600 bg-emerald-500/10 text-xs font-medium">
                        <Icon name="CheckCircle2" size={12} />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right rounded-r-lg">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Eye"
                        onClick={() => navigate(`/client-profile/${client.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        variant={client.isBlocked ? "default" : "destructive"}
                        size="sm"
                        iconName={client.isBlocked ? "CheckCircle2" : "Ban"}
                      >
                        {client.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-3 space-y-3">
          {clients.map((client) => (
            <div key={client.id} className="bg-background rounded-xl border border-border p-3 shadow-sm">
              <div className="flex items-start gap-3">
                <Image
                  src={getClientAvatar(client)}
                  alt={client.name}
                  className="w-11 h-11 rounded-full object-cover border border-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{client.code}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getLoanStatusColor(
                        client.loanStatus,
                      )}`}
                    >
                      {client.loanStatus}
                    </span>
                    {client.isBlocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-red-600 bg-red-500/10 text-xs">
                        <Icon name="Ban" size={11} />
                        Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-emerald-600 bg-emerald-500/10 text-xs">
                        <Icon name="CheckCircle2" size={11} />
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">{client.phone}</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  onClick={() => navigate(`/client-profile/${client.id}`)}
                >
                  View
                </Button>
                <Button
                  variant={client.isBlocked ? "default" : "destructive"}
                  size="sm"
                  iconName={client.isBlocked ? "CheckCircle2" : "Ban"}
                >
                  {client.isBlocked ? "Unblock" : "Block"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && clients.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">No clients found</div>
        )}

        {isError && <div className="p-10 text-center text-red-600">Failed to load clients</div>}
      </div>

      <div className="bg-card border border-border rounded-b-xl p-4 flex flex-col md:flex-row items-center gap-4 mb-5">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-semibold">{startItem}</span> to{" "}
          <span className="font-semibold">{endItem}</span> of{" "}
          <span className="font-semibold">{totalItems}</span>
        </div>

        <div className="flex items-center gap-4 md:ml-auto">
          <Select
            options={pageSizeOptions}
            value={itemsPerPage.toString()}
            onChange={(v) => {
              setItemsPerPage(parseInt(v, 10));
              setCurrentPage(1);
            }}
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            />
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchClients;
