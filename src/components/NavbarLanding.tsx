import { View, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { Layout } from "../styles/Layout";
import cdc_transparent_black from "../assets/images/cdc_transparent_black.png"

type NavbarNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const NavbarLanding = () => {
    const navigation = useNavigation<NavbarNavigationProp>();

    return (
        <View style={[Layout.navbarContainer, {backgroundColor: "#FAF3E0", flexDirection: "row", justifyContent: "center", alignContent: "center"}]}>
                <Image source={cdc_transparent_black} style={{width: 250, height: 250, resizeMode: "contain"}} />
        </View>
    );
}

export default NavbarLanding;