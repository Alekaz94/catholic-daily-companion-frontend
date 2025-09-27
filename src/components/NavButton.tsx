import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Layout } from "../styles/Layout";
import React from "react";
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../hooks/useAppTheme";
import { auth } from "../../firebase";

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
    const theme = useAppTheme();
    const isScreenActive = route.name === screen || (activeScreens?.includes(route.name as keyof AuthStackParamList));
    const showActive = isActive ?? isScreenActive;

    return (
        <TouchableOpacity 
            testID={testID}
            activeOpacity={0.7} 
            style={[
                Layout.navbarButton, 
                showActive && { backgroundColor: theme.auth.text, borderRadius: 16, borderWidth: 1, borderColor: theme.auth.text },
                style,
            ]} 
            onPress={onPress ? onPress : () => screen && navigation.navigate(screen)}
        >
            {icon && <Ionicons name={icon} size={18} color={theme.auth.text} />}
            <Text style={[
                Layout.navbarButtonText,
                {color: theme.auth.text},
                textStyle,
                showActive && { fontWeight: "bold"}
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
  };

  export default NavButton;
  