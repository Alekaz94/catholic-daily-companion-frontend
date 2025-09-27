import { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";

type ThemeType = "light" | "dark";

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    setTheme: () => {},
    isDark: false,
    toggleTheme: () => {}
});

export const ThemeProvider = ({ children }: {children: React.ReactNode}) => {
    const systemTheme: ColorSchemeName = Appearance.getColorScheme();
    const [theme, setTheme] = useState<ThemeType>(systemTheme === "dark" ? "dark" : "light")

    const toggleTheme = () => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    };

    useEffect(() => {
        const listener = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(colorScheme === "dark" ? "dark" : "light");
        });
        return () => listener.remove();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDark: theme === "dark", toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);
