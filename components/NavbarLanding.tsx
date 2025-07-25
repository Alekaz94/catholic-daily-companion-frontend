import { View } from "react-native";
import LogoutButton from "./LogoutButton";
import NavButton from "./NavButton";
import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { Layout } from "../styles/Layout";

type NavbarNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const NavbarLanding = () => {
    const navigation = useNavigation<NavbarNavigationProp>();

    return (
        <View style={Layout.navbarContainer}>
            <NavButton title={"Login"} screen={"Login"} />
            <NavButton title={"Sign up"} screen={"Signup"} />
        </View>
    );
}

export default NavbarLanding;