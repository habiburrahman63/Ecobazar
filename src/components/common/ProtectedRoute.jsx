import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedroles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAdminRoute = location.pathname.startsWith("/admin");

  if (!isAuthenticated || !user) {
    // If an unauthenticated user attempts to access /admin routes, send them to dedicated /admin/login
    if (isAdminRoute) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = user.role || "user";
  const hasAccess =
    role === "admin" ||
    (allowedroles ? allowedroles.includes(role) : true);

  if (!hasAccess) {
    // Ordinary authenticated customer trying to access /admin
    if (isAdminRoute) {
      return <Navigate to="/admin/login" state={{ accessDenied: true }} replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
