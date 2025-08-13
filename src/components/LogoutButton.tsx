import { TouchableOpacity, Text, Modal, View } from "react-native"
import { useAuth } from '../context/AuthContext';
import { Layout } from "../styles/Layout";
import { useState } from "react";
import { Colors } from "../styles/colors";
import { Typography } from "../styles/Typography";
import React from "react";
import { Ionicons } from '@expo/vector-icons';

const LogoutButton = () => {
    const {logout} = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    const handleLogout = async () => {
        await logout();
        setIsVisible(false);
        alert('Logout successfull!');
    }



    return (
        <>
        <TouchableOpacity style={[Layout.navbarButton, {backgroundColor: Colors.primary, flexDirection: "row", justifyContent: "center"}]} onPress={() => {
            setIsVisible(true)
        }}>
        <Ionicons name="log-out-outline" color={"white"} size={20} />
        <Text style={[Layout.buttonText, {color: "white"}]}> Logout</Text>
        </TouchableOpacity>
    

        <Modal
            animationType="fade"
            transparent
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}
        >
             <View style={[Layout.container, {width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.4)'}]}>
                <View style={{alignItems: "center", padding: 20, width: "80%", backgroundColor: Colors.surface, borderRadius: 12, borderColor: "black", borderWidth: 1}}>
                    <Text style={Typography.title}>Are you sure you want to logout?</Text>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            style={[Layout.button, {backgroundColor: Colors.success, width: "30%", marginRight: 20}]}
                            onPress={handleLogout}
                        >
                            <Text style={Typography.body}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Layout.button, {backgroundColor: "gray", width: "30%"}]}
                            onPress={() => setIsVisible(false)}
                        >
                            <Text style={Typography.body}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </>
    )
}

export default LogoutButton;