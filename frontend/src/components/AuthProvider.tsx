import { useState, useEffect, createContext, useContext } from 'react';
// import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { ReactNode } from 'react';
import type { User, UserWeights } from '../types/user';
import type { CurrentUserResponse, UserWeightsResponse, LogoutResponse } from '../types/api';

/**
 * Provides global authentication state for the application.
 * Stores the current user, loading state, and helper functions
 * for refreshing authentication information.
 */

type AuthContextType = {
    user: User | null;
    // setUser: Dispatch<React.SetStateAction<User | null>>;
    weights: UserWeights | null;
    loading: boolean;
    hasTakenQuiz: () => boolean;
    refreshUser: () => Promise<void>;
    refreshWeights: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [weights, setWeights] = useState<UserWeights | null>(null);

    async function logout(): Promise<void> {
        // Ends the user's session on the backend and clears
        // the user state in the frontend.
        try {
            const response = await fetch('/api/user/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
    
            // const data: LogoutResponse = await response.json();
    
            if (response.ok) {
                console.log('logged out');
                setUser(null);
                setWeights(null);
            } else {
                throw new Error('Logout failed');
            }
            
        } catch (err) {
            console.error(err);
        }
    }

    async function refreshWeights(): Promise<void> {
        // Fetch the currently authenticated user's weights from the backend
        // and update the global weights state.
        try {
            const response = await fetch('/api/user/weights', {
                credentials: 'include',
            });

            const data: UserWeightsResponse = await response.json();

            if (response.ok && 'weights' in data) {
                setWeights(data.weights);
            } else {
                setWeights(null);
            }
        } catch (err) {
            console.error(err);
            setWeights(null);
        }
    }


    async function refreshUser(): Promise<void> {
        // Fetch the currently authenticated user from the backend
        // and update the global auth state.
        try {
            const response = await fetch('/api/user/info', {
                credentials: 'include',
            });

            const data: CurrentUserResponse = await response.json();

            if (response.ok) {
                setUser({
                    ...data,
                    has_taken_quiz: Boolean(data.has_taken_quiz),
                });

                if (data.has_taken_quiz) {
                    await refreshWeights();
                } else {
                    setWeights(null);
                }
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Check for an existing logged-in session when the app loads.
        refreshUser();
    }, []);

    function hasTakenQuiz(): boolean {
        return user?.has_taken_quiz ?? false;
    }

    return (
        <AuthContext.Provider
            value={{ user, weights, loading, hasTakenQuiz, refreshUser, refreshWeights, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}

export default AuthProvider;
