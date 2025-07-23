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

const NavbarReading = () => {
    const navigation = useNavigation<NavbarNavigationProp>();

    return (
        <View style={Layout.navbarContainer}>
            <Ionicons 
                name="person-circle-outline"
                size={26}
                color="white"
                onPress={() => navigation.navigate("Profile")}
            />
            <NavButton title={"Saints"} screen={"Saint"} />
            <NavButton title={"Home"} screen={"Home"} />
            <NavButton title={"My journal"} screen={"Journal"} />
            <LogoutButton />
        </View>
    );
}

export default NavbarReading;