import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { User } from '../types/user';
import type { CurrentUserResponse } from '../types/api';

/**
 * Provides global authentication state for the application.
 * Stores the current user, loading state, and helper functions
 * for refreshing authentication information.
 */

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  hasTakenQuiz: () => boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser(): Promise<void> {
    // Fetch the currently authenticated user from the backend
    // and update the global auth state.
    try {
      const response = await fetch('/api/get_current_user', {
        credentials: 'include',
      });

      const data: CurrentUserResponse = await response.json();

      if (response.ok) {
        setUser({
          ...data,
          has_taken_quiz: Boolean(data.has_taken_quiz),
        });
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
      value={{ user, setUser, loading, hasTakenQuiz, refreshUser }}
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
