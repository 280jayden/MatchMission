import {useState, useEffect, createContext, useContext} from "react";

/**
 * Provides global authentication state for the application.
 * Stores the current user, loading state, and helper functions
 * for refreshing authentication information.
 */

const AuthContext = createContext();

function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    // Fetch the currently authenticated user from the backend
    // and update the global auth state.
    try{
      const response = await fetch("/api/get_current_user", {
        credentials: "include",
      });
      
      const data = await response.json();

      if (response.ok) {
        setUser({
          ...data,
          has_taken_quiz: Boolean(data.has_taken_quiz),
        })
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

  function hasTakenQuiz(){
    return user?.has_taken_quiz ?? false
  }

  return(
    <AuthContext.Provider value={{ user, setUser, loading, hasTakenQuiz, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}


export default AuthProvider;