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

const NavbarJournal = () => {
    const navigation = useNavigation<NavbarNavigationProp>();

    return (
        <View style={Layout.navbarContainer}>
            <Ionicons 
                name="person-circle-outline"
                size={26}
                color="#1A1A1A"
                onPress={() => navigation.navigate("Profile")}
            />
            <NavButton title={"Saints"} screen={"Saint"} />
            <NavButton title={"Mass readings"} screen={"Reading"} />
            <NavButton title={"Home"} screen={"Home"} />
            <LogoutButton />
        </View>
    );
}

export default NavbarJournal;