import { TextStyle } from "react-native";

interface TypographyStyles {
    title: TextStyle;
    label: TextStyle;
    body: TextStyle;
    small: TextStyle
}

export const Typography: TypographyStyles = {
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#222',
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: '#444',
      marginBottom: 4,
    },
    body: {
      fontSize: 14,
      color: '#333',
    },
    small: {
      fontSize: 12,
      color: '#666',
    },
  };