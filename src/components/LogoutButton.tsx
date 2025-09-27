import { TouchableOpacity, Text, Modal, View, ActivityIndicator } from "react-native"
import { useAuth } from '../context/AuthContext';
import { Layout } from "../styles/Layout";
import { useState } from "react";
import { Colors } from "../styles/colors";
import { Typography } from "../styles/Typography";
import React from "react";
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../hooks/useAppTheme";

const LogoutButton = () => {
    const {logout} = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useAppTheme();

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await logout();
            setIsVisible(false);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
        <TouchableOpacity style={[Layout.button, {backgroundColor: theme.saint.background, borderWidth: 1, flexDirection: "row", justifyContent: "center", opacity: isLoading ? 0.7 : 1}]} onPress={() => {
            setIsVisible(true)
        }}>
            {isLoading ? (
                <ActivityIndicator color={theme.auth.text} />
            ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="log-out-outline" color={theme.auth.text} size={20} />
                    <Text style={[Layout.buttonText, {color: theme.auth.text}]}> Logout</Text>
                </View>
            )}
        </TouchableOpacity>
    

        <Modal
            animationType="fade"
            transparent
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}
        >
             <View style={[Layout.container, {width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.4)',}]}>
                <View style={{alignItems: "center", padding: 20, width: "100%", backgroundColor: theme.auth.background, borderRadius: 12, borderColor: theme.auth.text, borderWidth: 1}}>
                    <Text style={[Typography.title, {color: theme.auth.text}]}>Are you sure you want to logout?</Text>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            style={[Layout.button, {backgroundColor: Colors.success, width: "30%", marginRight: 40, borderWidth: 1}]}
                            onPress={handleLogout}
                        >
                            <Text style={[Layout.buttonText, {color: theme.auth.text}]}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Layout.button, {backgroundColor: Colors.error, width: "30%", borderWidth: 1}]}
                            onPress={() => setIsVisible(false)}
                        >
                            <Text style={[Layout.buttonText, {color: theme.auth.text}]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </>
    )
}

export default LogoutButton;