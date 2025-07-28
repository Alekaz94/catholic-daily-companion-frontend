import { View } from "react-native";
import NavButton from "./NavButton";
import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { Layout } from "../styles/Layout";

type NavbarNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const NavbarSaint = () => {
    const navigation = useNavigation<NavbarNavigationProp>();

    return (
        <View style={[Layout.navbarContainer, {backgroundColor: "#FFD700"}]}>
            <Ionicons 
                name="person-circle-outline"
                size={26}
                color="#1A1A1A"
                onPress={() => navigation.navigate("Profile")}
            />
            <NavButton style={{backgroundColor: "#FFD700"}} title={"Home"} screen={"Home"}/>
            <NavButton style={{backgroundColor: "#FFD700"}} title={"Mass readings"} screen={"Reading"} />
            <NavButton style={{backgroundColor: "#FFD700"}} title={"My journal"} screen={"Journal"} />
        </View>
    );
}

export default NavbarSaint;