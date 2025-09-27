import { useTheme } from "../context/ThemeContext"
import { DarkAppTheme, LightAppTheme } from "../styles/colors";

export const useAppTheme = () => {
    const { isDark } = useTheme();
    return isDark ? DarkAppTheme : LightAppTheme;
}