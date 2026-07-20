import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import type { ReactNode } from 'react';
import LoadingText from './LoadingText';

/**
 * Route guard that only renders protected pages for authenticated users.
 * Redirects unauthenticated users to the login page.
 */

type RequireAuthProps = {
    children: ReactNode;
};

function RequireAuth({ children }: RequireAuthProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingText />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default RequireAuth;
