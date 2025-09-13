import { TextStyle } from "react-native";
import { Colors } from "./colors";

interface TypographyStyles {
    title: TextStyle;
    label: TextStyle;
    body: TextStyle;
    small: TextStyle;
    link: TextStyle;
    italic: TextStyle;
    bold: TextStyle;
}

export const Typography: TypographyStyles = {
    title: {
      fontFamily: "Playfair-ExtraBold",
      fontSize: 24,
      color: 'black',
      marginBottom: 16,
    },
    label: {
      fontFamily: "Playfair-Italic",
      fontSize: 20,
      color: "black",
      marginBottom: 4,
    },
    body: {
      fontFamily: "Playfair-Regular",
      fontSize: 16,
      color: 'black',
    },
    small: {
      fontFamily: "Playfair-Regular",
      fontSize: 12,
      color: 'black',
    },
    link: {
      fontFamily: "Playfair-Regular",
      color: Colors.primary,
      textDecorationLine: 'underline',
      fontSize: 16,
    },
    italic: {
      fontFamily: "Playfair-Italic",
      fontSize: 14,
      color: "black",
    },
    bold: {
      fontFamily: "Playfair-Bold",
      fontSize: 14,
      color: "black",
    }
  };