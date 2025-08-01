import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Layout } from "../styles/Layout";
import React from "react";

type Props = {
    title: string;
    screen: keyof AuthStackParamList;
    style?: object;
    textStyle?: object;
    testID?: string;
}

const NavButton: React.FC<Props> = ({ title, screen, style, textStyle, testID }) => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    return (
        <TouchableOpacity testID={testID} style={[Layout.navbarButton, style]} onPress={() => navigation.navigate(screen)}>
            <Text style={[Layout.navbarButtonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
  };

  export default NavButton;
  