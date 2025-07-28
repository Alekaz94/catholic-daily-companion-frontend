import { View } from "react-native";
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
        <View style={[Layout.navbarContainer, {backgroundColor: "#B794F4"}]}>
            <Ionicons 
                name="person-circle-outline"
                size={26}
                color="#1A1A1A"
                onPress={() => navigation.navigate("Profile")}
            />
            <NavButton style={{backgroundColor: "#B794F4"}} title={"Saints"} screen={"Saint"} />
            <NavButton style={{backgroundColor: "#B794F4"}} title={"Mass readings"} screen={"Reading"} />
            <NavButton style={{backgroundColor: "#B794F4"}} title={"Home"} screen={"Home"} />
        </View>
    );
}

export default NavbarJournal;