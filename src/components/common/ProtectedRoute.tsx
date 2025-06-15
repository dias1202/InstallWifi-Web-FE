import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const adminRaw = localStorage.getItem("admin");

  try {
    const admin = adminRaw ? JSON.parse(adminRaw) : null;
    if (!admin) {
      return <Navigate to="/signin" replace />;
    }
    return <>{children}</>;
  } catch (error) {
    return <Navigate to="/signin" replace />;
  }
}
