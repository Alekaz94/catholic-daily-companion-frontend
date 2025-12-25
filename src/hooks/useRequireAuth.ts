import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"
import { reset } from "../navigation/RootNavigation";
import { loadUserFromStorage } from "../services/AuthService";

export const useRequireAuth = () => {
    const { user: contextUser, setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const checkUser = async () => {
            if (!contextUser) {
              const storedUser = await loadUserFromStorage();
              if (storedUser) {
                setUser?.(storedUser);
              }
            }
            setLoading(false);
          };
          checkUser();
        }, [contextUser]);
      
        return { user: contextUser, loading };
    };