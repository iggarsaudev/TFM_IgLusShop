import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface RequireAuthProps {
  allowedRoles: string[];
}

export default function RequireAuth({ allowedRoles }: RequireAuthProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user!.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
