import React from "react";
import { Navigate } from "react-router-dom";

const StaffAttendance = () => {
  return <Navigate to="/staff-management?tab=attendance" replace />;
};

export default StaffAttendance;
