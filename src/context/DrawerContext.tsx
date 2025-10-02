import { createContext, ReactNode, useContext } from "react";

type DrawerContextType = {
    openDrawer: () => void;
}

type DrawerProviderProps = {
    openDrawer: () => void;
    children: ReactNode;
  };

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ openDrawer, children }) => {
    return (
        <DrawerContext.Provider value={{openDrawer}} >
            {children}
        </DrawerContext.Provider>
    )
}

export const useDrawer = () => {
    const context = useContext(DrawerContext);
    if (!context) {
      throw new Error('useDrawer must be used within a DrawerProvider');
    }
    return context;
};