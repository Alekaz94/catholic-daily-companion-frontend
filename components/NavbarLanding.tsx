import { View } from "react-native";
import NavButton from "./NavButton";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { Layout } from "../styles/Layout";

type NavbarNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const NavbarLanding = () => {
    const navigation = useNavigation<NavbarNavigationProp>();

    return (
        <View style={[Layout.navbarContainer, {backgroundColor: "#FAF3E0"}]}>
            <NavButton style={{backgroundColor: "#FAF3E0"}} title={"Login"} screen={"Login"} />
            <NavButton style={{backgroundColor: "#FAF3E0"}} title={"Sign up"} screen={"Signup"} />
        </View>
    );
}

export default NavbarLanding;