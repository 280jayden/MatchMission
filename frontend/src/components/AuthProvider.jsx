import {useState, useEffect, createContext, useContext} from "react";

const AuthContext = createContext();

function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {

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
        }

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    
    }


  useEffect(() => {
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