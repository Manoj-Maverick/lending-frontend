import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetClientsList } from "hooks/clients.management.page.hooks/useGetClientsList";
import { useUIContext } from "context/UIContext";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

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
  { value: "10", label: "10 per page" },
  { value: "25", label: "25 per page" },
  { value: "50", label: "50 per page" },
  { value: "100", label: "100 per page" },
];

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/* =========================
   COMPONENT
========================= */
const ClientsListPage = () => {
  const navigate = useNavigate();
  const { branches } = useUIContext();
  const branchOptions = useMemo(() => {
    const base = [{ value: "all", label: "All Branches" }];

    if (!branches || branches.length === 0) return base;

    return [
      ...base,
      ...branches.map((b) => ({
        value: b.id,
        label: b.branch_name,
      })),
    ];
  }, [branches]);
  console.log("Branch Options for Filter:", branches);
  const [filters, setFilters] = useState({
    search: "",
    branch: "all",
    status: "all",
    blockStatus: "all",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* -------------------------
     Debounced Search (prevents focus loss + spam fetch)
  ------------------------- */
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(t);
  }, [filters.search]);

  /* -------------------------
     Fetch from Backend
  ------------------------- */
  const { data, isLoading, isFetching, isError } = useGetClientsList({
    branchId: filters.branch === "all" ? null : filters.branch,
    search: debouncedSearch,
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

  /* -------------------------
     Handlers
  ------------------------- */
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

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: "bg-blue-500/10 text-blue-600",
      "No Loans": "bg-gray-500/10 text-gray-600",
    };
    return colors[status] || colors["No Loans"];
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="bg-card border border-border rounded-lg overflow-visible mb-5">
      {/* ================= FILTER BAR ================= */}
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="Filter" size={20} className="text-muted-foreground" />
            <h2 className="text-base md:text-lg font-semibold text-foreground">
              Filter Clients
            </h2>
          </div>
          <div className="text-xs md:text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-accent">{clients.length}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{totalItems}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Input
              type="search"
              placeholder="Search by name, phone, or code..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
            />
          </div>

          <Select
            options={branchOptions}
            value={filters.branch}
            onChange={(v) => onFilterChange("branch", v)}
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
            Updating results…
          </div>
        )}
      </div>

      {/* ================= TABLE ================= */}
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
                    className={`px-2 py-1 rounded text-xs whitespace-nowrap ${getStatusColor(
                      client.loan_status,
                    )}`}
                  >
                    {client.loan_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    onClick={() => navigate(`/client-profile/${client.id}`)}
                  >
                    View
                  </Button>
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

      {/* ================= PAGINATION ================= */}
      <div className="p-4 border-t border-border flex flex-col md:flex-row items-center gap-4 overflow-visible">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-semibold">{startItem}</span> to{" "}
          <span className="font-semibold">{endItem}</span> of{" "}
          <span className="font-semibold">{totalItems}</span>
        </div>

        <div className="md:ml-auto flex items-center gap-4 overflow-visible">
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

export default ClientsListPage;
