import { Colors } from "./colors";
import { ViewStyle, TextStyle, ImageStyle } from "react-native";

interface LayoutStyles {
    container: ViewStyle;
    navbarContainer: ViewStyle;
    card: ViewStyle;
    input: ViewStyle;
    button: ViewStyle;
    buttonText: TextStyle;
    navbarButton: ViewStyle;
    navbarButtonText: TextStyle;
    image: ImageStyle;
    }

export const Layout: LayoutStyles = {
    container: {
      flex: 1,
      padding: 20,
    },
    navbarContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 80,
        paddingHorizontal: 10,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
    },
    card: {
      borderRadius: 8,
      padding: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 6,
      padding: 10,
      marginBottom: 12,
      backgroundColor: '#fff',
    },
    button: {
      backgroundColor: Colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center' as const,
      marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
    },
    navbarButton: {
        backgroundColor: "#D4AF37",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center' as const,
        marginTop: 10,
    },
    navbarButtonText: {
        color: "#1A1A1A",
        fontSize: 14,
        fontWeight: 'bold',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        resizeMode: "cover"
      },
  };