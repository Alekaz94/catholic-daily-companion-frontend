import { View, Text } from "react-native";
import NavButton from "./NavButton";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";

type NavbarNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const NavbarLanding = () => {
    const navigation = useNavigation<NavbarNavigationProp>();

    return (
        <View style={[Layout.navbarContainer, {backgroundColor: "#FAF3E0", flexDirection: "column"}]}>
            <View>
                <Text style={[Typography.title, {marginBottom: -15, fontSize: 18}]}>Catholic Daily Companion</Text>
            </View>
            <View style={{flexDirection: "row", gap: 50}}>
                <NavButton testID="navbutton-Login" style={{backgroundColor: "#FAF3E0"}} title={"Login"} screen={"Login"} icon="log-in-outline"/>
                <NavButton testID="navbutton-Signup" style={{backgroundColor: "#FAF3E0"}} title={"Sign up"} screen={"Signup"} icon="person-add-outline"/>
            </View>
        </View>
    );
}

export default NavbarLanding;