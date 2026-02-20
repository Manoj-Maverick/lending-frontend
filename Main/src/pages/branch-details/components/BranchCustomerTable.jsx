import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

import { useFetchBranchCustomers as useBranchClients } from "../../../hooks/branch.details.page.hooks/useGetBranchCustomers";

/* =========================
   OPTIONS
========================= */
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

/* =========================
   COMPONENT
========================= */
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

  // ✅ SAME color schema as v1
  const getStatusColor = (status) => {
    const colors = {
      Active: "bg-blue-500/10 text-blue-600",
      "No Loan": "bg-gray-500/10 text-gray-600",
    };
    return colors[status] || colors["No Loan"];
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // 🔌 Call backend via React Query hook
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
    <div className="space-y-0 mb-4">
      {/* FILTERS */}
      <div className="bg-card border border-border rounded-t-lg rounded-b-none p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon name="Filter" size={18} className="text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Filter Clients</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-accent">{clients.length}</span>{" "}
            of{" "}
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

        {isFetching && (
          <div className="mt-2 text-xs text-muted-foreground">
            Updating results...
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-card border-x border-border border-t-0 border-b-0 rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">
                  Photo
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name <Icon name={getSortIcon("name")} size={14} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold">
                  Phone
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold cursor-pointer"
                  onClick={() => handleSort("code")}
                >
                  <div className="flex items-center gap-2">
                    Code <Icon name={getSortIcon("code")} size={14} />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold cursor-pointer"
                  onClick={() => handleSort("loanStatus")}
                >
                  <div className="flex items-center gap-2">
                    Loan Status{" "}
                    <Icon name={getSortIcon("loanStatus")} size={14} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold">
                  Customer Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                      {client.photo ? (
                        <Image src={client.photo} alt={client.name} />
                      ) : (
                        <span className="text-sm font-semibold text-foreground">
                          {getInitials(client.name)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{client.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {client.phone}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">{client.code}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs whitespace-nowrap inline-block ${getStatusColor(
                        client.loanStatus === "ACTIVE"
                          ? "Active"
                          : client.loanStatus,
                      )}`}
                    >
                      {client.loanStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {client.isBlocked ? (
                      <span className="text-red-600 text-sm">Blocked</span>
                    ) : (
                      <span className="text-emerald-600 text-sm">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
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

          {!isLoading && clients.length === 0 && (
            <div className="p-10 text-center text-muted-foreground">
              No clients found
            </div>
          )}

          {isError && (
            <div className="p-10 text-center text-red-600">
              Failed to load clients
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="bg-card border border-border rounded-b-lg p-4 flex flex-col md:flex-row items-center gap-4 mb-5">
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
              setItemsPerPage(parseInt(v));
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
