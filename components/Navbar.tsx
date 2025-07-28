import { View } from "react-native";
import NavButton from "./NavButton";
import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { Layout } from "../styles/Layout";

type NavbarNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const Navbar = () => {
    const navigation = useNavigation<NavbarNavigationProp>();

    return (
        <View style={[Layout.navbarContainer, {backgroundColor: "#FAF3E0"}]}>
            <Ionicons 
                name="person-circle-outline"
                size={26}
                color="#1A1A1A"
                style={{marginTop: 7}}
                onPress={() => navigation.navigate("Profile")}
            />
            <NavButton style={{backgroundColor: "#FAF3E0"}} title={"Saints"} screen={"Saint"} />
            <NavButton style={{backgroundColor: "#FAF3E0"}} title={"Mass readings"} screen={"Reading"} />
            <NavButton style={{backgroundColor: "#FAF3E0"}} title={"My journal"} screen={"Journal"} />
        </View>
    );
}

export default Navbar;