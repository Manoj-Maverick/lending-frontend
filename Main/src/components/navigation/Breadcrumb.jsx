import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../AppIcon";

const Breadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const routeMap = {
    "/dashboard": "Dashboard",
    "/branches-management": "Branches",
    "/branch-details": "Branch Details",
    "/clients-management": "Clients",
    "/client-profile": "Client Profile",
    "/loans-management": "Loans",
    "/loan-details": "Loan Details",
    "/payments-management": "Payments",
    "/staff-management": "Staff",
    "/staff-profile": "Staff Profile",
    "/reports": "Reports",
    "/settings": "Settings",
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split("/")?.filter(Boolean);
    const breadcrumbs = [{ label: "Home", path: "/dashboard" }];

    let currentPath = "";
    pathSegments?.forEach((segment) => {
      currentPath += `/${segment}`;
      if (routeMap?.[currentPath]) {
        breadcrumbs?.push({
          label: routeMap?.[currentPath],
          path: currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {breadcrumbs?.map((crumb, index) => (
        <div key={`${crumb?.path}-${index}`} className="breadcrumb-item">
          {index > 0 && (
            <Icon
              name="ChevronRight"
              size={16}
              className="breadcrumb-separator"
            />
          )}
          {index === breadcrumbs?.length - 1 ? (
            <span className="breadcrumb-current">{crumb?.label}</span>
          ) : (
            <span
              className="breadcrumb-link"
              onClick={() => navigate(crumb?.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e?.key === "Enter" || e?.key === " ") {
                  navigate(crumb?.path);
                }
              }}
            >
              {crumb?.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
