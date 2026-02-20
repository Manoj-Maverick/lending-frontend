import { createContext, useContext, useState } from "react";

const UIContext = createContext(null);

export const UIContextProvider = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [currentTheme, setCurrentTheme] = useState("light");

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
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  return useContext(UIContext);
};
