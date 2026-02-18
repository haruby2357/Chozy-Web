import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!token) {
    return (
      <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />
    );
  }

  return <>{children}</>;
}
