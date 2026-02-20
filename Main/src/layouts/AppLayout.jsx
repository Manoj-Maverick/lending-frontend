import { Outlet } from "react-router-dom";
import Sidebar from "components/navigation/Sidebar";
import Header from "components/navigation/Header";
import { useUIContext } from "context/UIContext";
import { useEffect } from "react";
import { useBranches } from "hooks/branches.management.page.hooks/usebranches";
import { useAuth } from "auth/AuthContext";

const AppLayout = () => {
  const {
    setBranches,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    selectedBranch,
    setSelectedBranch,
    currentTheme,
    setCurrentTheme,
  } = useUIContext();
  const { user, authLoading } = useAuth();
  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
  };

  const handleThemeToggle = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    document.documentElement?.classList?.toggle("dark", newTheme === "dark");
  };
  const { data: branches } = useBranches(user, authLoading);

  useEffect(() => {
    if (!selectedBranch && branches?.length) {
      setSelectedBranch({
        id: "all",
        branch_name: "All Branches",
        location: "System Wide",
      });
    }
  }, [branches, selectedBranch]);

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(false);
      }
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    if (branches?.length) {
      setBranches(branches);
    }
  }, [branches]);
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Sidebar
        user={user}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        branches={branches}
        selectedBranch={selectedBranch}
        handleBranchChange={handleBranchChange}
      />
      <div
        className={`transition-all duration-250 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-[280px]"
        } min-w-0`}
      >
        <Header
          user={user}
          selectedBranch={selectedBranch}
          branches={branches}
          handleBranchChange={handleBranchChange}
          handleThemeToggle={handleThemeToggle}
          currentTheme={currentTheme}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />
        <main className="mt-5 px-4 md:px-6 lg:px-8 pb-6 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
