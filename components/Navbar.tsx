import { View, StyleSheet } from "react-native";
import LogoutButton from "./LogoutButton";
import NavButton from "./NavButton";
import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Navbar = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <NavButton title={"Saints"} screen={"Saint"} />
            <NavButton title={"Mass readings"} screen={"Reading"} />
            <NavButton title={"My journal"} screen={"Journal"} />
            <LogoutButton />
            <Ionicons 
                name="person-circle-outline"
                size={26}
                color="gray"
                onPress={() => navigation.navigate("Profile")}
            />
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#6200ee",
        paddingTop: 40,
        paddingBottom: 10,
        paddingHorizontal: 10,    
    },
})

export default Navbar;