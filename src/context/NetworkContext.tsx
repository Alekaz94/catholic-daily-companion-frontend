import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

interface NetworkContextType {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    lastChange: number;
    refreshConnection: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType>({
    isConnected: true,
    isInternetReachable: null,
    lastChange: Date.now(),
    refreshConnection: async () => {},
});

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(true);
    const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
    const [lastChange, setLastChange] = useState(Date.now());

    const updateState = (state: NetInfoState) => {
        setIsConnected(Boolean(state.isConnected));
        setIsInternetReachable(state.isInternetReachable);
        setLastChange(Date.now());
    };

    const refreshConnection = useCallback(async () => {
        const state = await NetInfo.fetch();
        updateState(state);
    }, []);

    useEffect(() => {
        let timeout: number;
        const unsubscribe = NetInfo.addEventListener((state) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => updateState(state), 200);
        });

        return () => unsubscribe();
    }, []);

    return (
        <NetworkContext.Provider value={{ isConnected, isInternetReachable, lastChange, refreshConnection }}>
            {children}
        </NetworkContext.Provider>
    )
}

export const useNetwork = () => useContext(NetworkContext);