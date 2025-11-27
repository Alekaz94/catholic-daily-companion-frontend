import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import { reset } from "../navigation/RootNavigation";

export const useRequireAuth = () => {
    const { user } = useAuth();

    useEffect(() => {
        if(!user) {
            reset("Landing");
        }
    }, [user]);

    return user;
}