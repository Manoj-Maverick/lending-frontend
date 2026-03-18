import { createContext, useContext, useState } from "react";
import { useToast } from "./ToastContext";
const UIContext = createContext(null);

export const UIContextProvider = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [currentTheme, setCurrentTheme] = useState("light");
  const { showToast } = useToast();

  return (
    <UIContext.Provider
      value={{
        branches,
        setBranches,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        selectedBranch,
        setSelectedBranch,
        currentTheme,
        setCurrentTheme,
        showToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  return useContext(UIContext);
};
