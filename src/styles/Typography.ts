import { TextStyle } from "react-native";
import { Colors } from "./colors";
import { useTheme } from "../context/ThemeContext";

export const useTypography = () => {
  const { fontSize, fontStyle, resolvedTheme } = useTheme();

  const baseSize = fontSize === "small" ? 14 : fontSize === "large" ? 20 : 16;

  const family =
    fontStyle === "serif"
      ? {
        regular: "Playfair-Regular",
        bold: "Playfair-Bold",
        italic: "Playfair-Italic",
      }
      : {
        regular: "Inter-Regular",
        bold: "Inter-Bold",
        italic: "Inter-Italic",
      };

  return {
    title: {
      fontFamily: family.bold,
      fontSize: baseSize + 8,
      color: resolvedTheme === "dark" ? "white" : "black",
    } as TextStyle,
    body: {
      fontFamily: family.regular,
      fontSize: baseSize,
      color: resolvedTheme === "dark" ? "white" : "black",
    } as TextStyle,
    italic: {
      fontFamily: family.italic,
      fontSize: baseSize,
      fontStyle: "italic",
      color: resolvedTheme === "dark" ? "white" : "black",
    } as TextStyle,
    label: {
      fontFamily: family.bold,
      fontSize: baseSize + 2,
      color: resolvedTheme === "dark" ? "white" : "black"
    } as TextStyle
  }
  };