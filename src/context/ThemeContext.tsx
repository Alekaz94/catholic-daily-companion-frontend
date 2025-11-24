import { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import * as SecureStore from "expo-secure-store";

type ThemeMode = "light" | "dark" | "system";
type FontSizeType = "small" | "medium" | "large";
type FontStyleType = "serif" | "sans";

interface ThemeContextType {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;

    fontSize: FontSizeType;
    setFontSize: (size: FontSizeType) => void;

    fontStyle: FontStyleType;
    setFontStyle: (style: FontStyleType) => void;

    resolvedTheme: "light" | "dark";
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }: {children: React.ReactNode}) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>("system");
    const [fontSize, setFontSize] = useState<FontSizeType>("medium");
    const [fontStyle, setFontStyle] = useState<FontStyleType>("serif");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            const storedTheme = await SecureStore.getItemAsync("themeMode");
            const storedSize = await SecureStore.getItemAsync("fontSize");
            const storedStyle = await SecureStore.getItemAsync("fontStyle");

            if (storedTheme) setThemeMode(storedTheme as ThemeMode);
            if (storedSize) setFontSize(storedSize as FontSizeType);
            if (storedStyle) setFontStyle(storedStyle as FontStyleType);
            setIsReady(true);
        })();
    }, []);

    useEffect(() => {
        if (!isReady) return;

        SecureStore.setItemAsync("themeMode", themeMode);
        SecureStore.setItemAsync("fontSize", fontSize);
        SecureStore.setItemAsync("fontStyle", fontStyle);
    }, [themeMode, fontSize, fontStyle]);

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
          if (themeMode === "system") {
            
            setThemeMode("system");
          }
        });
      
        return () => subscription.remove();
    }, [themeMode]);

    const systemTheme: ColorSchemeName = Appearance.getColorScheme();
    const resolvedTheme =
        themeMode === "system" ? (systemTheme === "dark" ? "dark" : "light") : themeMode;

    const isDark = resolvedTheme === "dark";

    if (!isReady) return null;

    return (
        <ThemeContext.Provider 
            value={{
                themeMode,
                setThemeMode,
                fontSize,
                setFontSize,
                fontStyle,
                setFontStyle,
                resolvedTheme,
                isDark,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);
