import {useState, useEffect, createContext, useContext} from "react";

const AuthContext = createContext();

function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {

      try{
        const response = await fetch("/api/get_current_user", {
          credentials: "include",
        });
        
        const data = await response.json();

        if (response.ok) {
          setUser(data)
        }

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    
    }
    loadUser();
  }, []);


  return(
    <AuthContext.Provider value={{ user, setUser, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;