import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Layout } from "../styles/Layout";
import React from "react";
import { Ionicons } from '@expo/vector-icons';

type Props = {
    title: string;
    screen?: keyof AuthStackParamList;
    icon?: keyof typeof Ionicons.glyphMap;
    style?: object;
    textStyle?: object;
    testID?: string;
    activeScreens?: (keyof AuthStackParamList)[];
    onPress?: () => void;
    isActive?: boolean;
}

const NavButton: React.FC<Props> = ({ title, screen, icon, style, textStyle, testID, activeScreens, isActive, onPress }) => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const route = useRoute();
    const isScreenActive = route.name === screen || (activeScreens?.includes(route.name as keyof AuthStackParamList));
    const showActive = isActive ?? isScreenActive;

    return (
        <TouchableOpacity 
            testID={testID} 
            style={[
                Layout.navbarButton, 
                { flexDirection: "column", alignItems: "center", padding: 6 },
                showActive && { backgroundColor: "#E2E8F0", borderRadius: 6 },
                style,
            ]} 
            onPress={onPress ? onPress : () => screen && navigation.navigate(screen)}
        >
            {icon && <Ionicons name={icon} size={18} color={showActive ? "#007AFF" : "#1A1A1A"} />}
            <Text style={[
                Layout.navbarButtonText,
                textStyle,
                { fontSize: 12, marginTop: 2 },
                showActive && { fontWeight: "bold", color: "#007AFF" }
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
  };

  export default NavButton;
  