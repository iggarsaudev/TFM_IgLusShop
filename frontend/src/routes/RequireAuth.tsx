import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const { isAuthenticated, user } = useAuth();

  const isAllowed = isAuthenticated && user && allowedRoles.includes(user.role);

  return isAllowed ? <Outlet /> : <Navigate to="/login" replace />;
}
export default RequireAuth;