import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

/**
 * Route guard that only renders protected pages for authenticated users.
 * Redirects unauthenticated users to the login page.
 */

function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAuth;