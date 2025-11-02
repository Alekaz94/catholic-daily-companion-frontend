import { View, Text, Switch, ScrollView, TouchableOpacity } from "react-native"; 
import { useAppTheme } from "../hooks/useAppTheme"; 
import { useTheme } from "../context/ThemeContext"; 
import { Typography } from "../styles/Typography"; 
import Navbar from "../components/Navbar"; 
import Divider from "../components/Divider"; 
import { Layout } from "../styles/Layout"; 
import { SafeAreaView } from 'react-native-safe-area-context';
import DeleteAccountConfirmModal from "../components/DeleteAccountConfirmModal";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteUser } from "../services/UserService";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-root-toast";

const SettingsScreen = () => { 
    const theme = useAppTheme(); 
    const { isDark, toggleTheme } = useTheme(); 
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const {user, logout} = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteAccount = async () => {
        if(!user?.id) {
            return;
        }

        try {
            setIsLoading(true)
            await deleteUser(user.id);
            await SecureStore.deleteItemAsync("streak");
            await logout();

            Toast.show("Account deleted successfully.", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
            });
        } catch (error) {
            console.error("Delete account failed", error);
            Toast.show("Failed to delete account. Try again.", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
            });
        } finally {
            setIsLoading(false)
            setIsDeleteConfirmVisible(false);
        }
    }
    
    return ( 
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.navbar}}> 
            <ScrollView keyboardShouldPersistTaps="handled" style={{backgroundColor: theme.auth.background}}> 
                <Navbar /> 
                <View style={Layout.container}> 
                    <Text style={[Typography.italic, {textAlign: "center", fontSize: 22, fontWeight: "600", color: theme.auth.text}]}>Settings</Text> 
                    <Divider /> 
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10}}> 
                        <Text style={[Typography.body, { color: theme.auth.text, marginRight: 10 }]}> Dark Mode </Text> 
                        <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={isDark ? "#59512e" : '#FAF3E0'} /> 
                    </View> 
                    
                    <View style={{ marginTop: 10, borderTopWidth: 1, borderColor: 'red', paddingTop: 20 }}>
                        <Text style={[Typography.label, { color: 'red', fontWeight: 'bold', fontSize: 18 }]}>Danger Zone</Text>
                        <TouchableOpacity
                            style={[Layout.button, { backgroundColor: '#ff4d4f', borderColor: 'darkred', borderWidth: 1, marginTop: 10 }]}
                            onPress={() => setIsDeleteConfirmVisible(true)}
                        >
                            <Text style={{color: 'white'}}>Delete My Account</Text>
                        </TouchableOpacity>
                    </View>
                </View> 
            </ScrollView> 

            <DeleteAccountConfirmModal
                visible={isDeleteConfirmVisible}
                onClose={() => setIsDeleteConfirmVisible(false)}
                onConfirm={handleDeleteAccount}
                isLoading={isLoading}
            />
        </SafeAreaView> 
    ) 
} 

export default SettingsScreen;