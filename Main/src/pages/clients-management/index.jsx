import React, { useState, useEffect } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import ClientsListPage from "./components/clientsListPage";
import AddClientModal from "./components/AddClientModal";
import BlocklistModal from "./components/BlocklistModal";

const ClientsManagement = () => {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [filters, setFilters] = useState({
    search: "",
    branch: "all",
    status: "all",
    blockStatus: "all",
  });
  const [blocklistModal, setBlocklistModal] = useState({
    isOpen: false,
    clientData: null,
    isUnblocking: false,
  });

  const mockClients = [
    {
      id: "CL-001",
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      code: "CL-001",
      branch: "Main Branch",
      loanStatus: "Active",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1b09cae8d-1763295945796.png",
      photoAlt:
        "Professional headshot of Indian man with short black hair wearing blue shirt",
    },
    {
      id: "CL-002",
      name: "Priya Sharma",
      phone: "+91 98765 43211",
      code: "CL-002",
      branch: "North Branch",
      loanStatus: "Closed",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_111e29bbe-1763294966477.png",
      photoAlt:
        "Professional headshot of Indian woman with long black hair wearing traditional attire",
    },
    {
      id: "CL-003",
      name: "Amit Patel",
      phone: "+91 98765 43212",
      code: "CL-003",
      branch: "South Branch",
      loanStatus: "Active",
      isBlocked: true,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_17c3cbb98-1763291944258.png",
      photoAlt:
        "Professional headshot of Indian man with glasses wearing formal white shirt",
    },
    {
      id: "CL-004",
      name: "Sneha Reddy",
      phone: "+91 98765 43213",
      code: "CL-004",
      branch: "East Branch",
      loanStatus: "Delayed",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_131bae20c-1763295387671.png",
      photoAlt:
        "Professional headshot of Indian woman with short hair wearing business suit",
    },
    {
      id: "CL-005",
      name: "Vikram Singh",
      phone: "+91 98765 43214",
      code: "CL-005",
      branch: "West Branch",
      loanStatus: "Active",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_13bcb65fb-1763295902656.png",
      photoAlt:
        "Professional headshot of Indian man with beard wearing casual shirt",
    },
    {
      id: "CL-006",
      name: "Anita Desai",
      phone: "+91 98765 43215",
      code: "CL-006",
      branch: "Main Branch",
      loanStatus: "No Loan",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_19d9d7cd2-1763293467118.png",
      photoAlt:
        "Professional headshot of Indian woman with traditional jewelry wearing saree",
    },
    {
      id: "CL-007",
      name: "Suresh Menon",
      phone: "+91 98765 43216",
      code: "CL-007",
      branch: "North Branch",
      loanStatus: "Closed",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_14f111919-1763296777933.png",
      photoAlt:
        "Professional headshot of Indian man with mustache wearing formal attire",
    },
    {
      id: "CL-008",
      name: "Kavita Nair",
      phone: "+91 98765 43217",
      code: "CL-008",
      branch: "South Branch",
      loanStatus: "Active",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_13f081aab-1763301129228.png",
      photoAlt:
        "Professional headshot of Indian woman with long hair wearing modern dress",
    },
    {
      id: "CL-009",
      name: "Ravi Krishnan",
      phone: "+91 98765 43218",
      code: "CL-009",
      branch: "East Branch",
      loanStatus: "Active",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_10742e8ef-1763296701959.png",
      photoAlt:
        "Professional headshot of Indian man with short hair wearing polo shirt",
    },
    {
      id: "CL-010",
      name: "Deepa Iyer",
      phone: "+91 98765 43219",
      code: "CL-010",
      branch: "West Branch",
      loanStatus: "Delayed",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1d7bc43f2-1763293350422.png",
      photoAlt:
        "Professional headshot of Indian woman with glasses wearing professional attire",
    },
    {
      id: "CL-011",
      name: "Arun Gupta",
      phone: "+91 98765 43220",
      code: "CL-011",
      branch: "Main Branch",
      loanStatus: "Active",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_13b3e6533-1763292504789.png",
      photoAlt:
        "Professional headshot of Indian man with clean shave wearing business suit",
    },
    {
      id: "CL-012",
      name: "Meera Joshi",
      phone: "+91 98765 43221",
      code: "CL-012",
      branch: "North Branch",
      loanStatus: "No Loan",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_19d9d7cd2-1763293467118.png",
      photoAlt:
        "Professional headshot of Indian woman with traditional bindi wearing ethnic wear",
    },
    {
      id: "CL-013",
      name: "Karthik Rao",
      phone: "+91 98765 43222",
      code: "CL-013",
      branch: "South Branch",
      loanStatus: "Closed",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1b0783d8b-1763292927295.png",
      photoAlt:
        "Professional headshot of Indian man with side parting wearing formal shirt",
    },
    {
      id: "CL-014",
      name: "Lakshmi Pillai",
      phone: "+91 98765 43223",
      code: "CL-014",
      branch: "East Branch",
      loanStatus: "Active",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_19d9d7cd2-1763293467118.png",
      photoAlt:
        "Professional headshot of Indian woman with braided hair wearing traditional dress",
    },
    {
      id: "CL-015",
      name: "Manoj Verma",
      phone: "+91 98765 43224",
      code: "CL-015",
      branch: "West Branch",
      loanStatus: "Active",
      isBlocked: false,
      photo:
        "https://img.rocket.new/generatedImages/rocket_gen_img_13bcb65fb-1763295902656.png",
      photoAlt:
        "Professional headshot of Indian man with short beard wearing casual attire",
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev?.key === key && prev?.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleAddClient = (clientData) => {
    console.log("New client data:", clientData);
  };

  const handleBlockStatusChange = (client) => {
    setBlocklistModal({
      isOpen: true,
      clientData: client,
      isUnblocking: client?.isBlocked,
    });
  };

  const handleBlocklistConfirm = (data) => {
    console.log(
      blocklistModal?.isUnblocking ? "Unblocking" : "Blocking",
      blocklistModal?.clientData?.name,
      data?.reason,
    );
    setBlocklistModal({ isOpen: false, clientData: null, isUnblocking: false });
  };

  const filteredClients = mockClients?.filter((client) => {
    const matchesSearch =
      client?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      client?.phone?.includes(filters?.search) ||
      client?.code?.toLowerCase()?.includes(filters?.search?.toLowerCase());

    const matchesBranch =
      filters?.branch === "all" || client?.branch === filters?.branch;
    const matchesStatus =
      filters?.status === "all" || client?.loanStatus === filters?.status;

    const matchesBlockStatus =
      !filters?.blockStatus || filters?.blockStatus === "all"
        ? true
        : filters?.blockStatus === "blocked"
          ? client?.isBlocked
          : !client?.isBlocked;

    return (
      matchesSearch && matchesBranch && matchesStatus && matchesBlockStatus
    );
  });

  const sortedClients = [...filteredClients]?.sort((a, b) => {
    const aValue = a?.[sortConfig?.key];
    const bValue = b?.[sortConfig?.key];

    if (aValue < bValue) return sortConfig?.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig?.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedClients?.length / itemsPerPage);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2 flex items-center gap-3">
            <Icon name="Users" size={32} className="text-primary" />
            Clients Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage client profiles, relationships, and loan portfolios
          </p>
        </div>
        <Button
          variant="default"
          size="lg"
          iconName="UserPlus"
          iconPosition="left"
          onClick={() => setIsAddClientModalOpen(true)}
        >
          Add Client
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-card rounded-lg border border-border p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Icon
                name="Users"
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground">
              Total
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
            {mockClients?.length}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Total Clients
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Icon
                name="CircleDot"
                size={20}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground">
              Active
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
            {mockClients?.filter((c) => c?.loanStatus === "Active")?.length}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Active Loans
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Icon
                name="AlertCircle"
                size={20}
                className="text-amber-600 dark:text-amber-400"
              />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground">
              Delayed
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
            {mockClients?.filter((c) => c?.loanStatus === "Delayed")?.length}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Delayed Payments
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-500/10 flex items-center justify-center">
              <Icon
                name="Circle"
                size={20}
                className="text-gray-600 dark:text-gray-400"
              />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground">
              No Loan
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
            {mockClients?.filter((c) => c?.loanStatus === "No Loan")?.length}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Without Loans
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Icon
                name="Ban"
                size={20}
                className="text-red-600 dark:text-red-400"
              />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground">
              Blocked
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
            {mockClients?.filter((c) => c?.isBlocked)?.length}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Blocked Customers
          </p>
        </div>
      </div>

      <ClientsListPage />
      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onSubmit={handleAddClient}
      />
      {/* Blocklist Modal */}
      <BlocklistModal
        isOpen={blocklistModal?.isOpen}
        onClose={() =>
          setBlocklistModal({
            isOpen: false,
            clientData: null,
            isUnblocking: false,
          })
        }
        onConfirm={handleBlocklistConfirm}
        clientData={blocklistModal?.clientData}
        isUnblocking={blocklistModal?.isUnblocking}
      />
    </>
  );
};

export default ClientsManagement;
