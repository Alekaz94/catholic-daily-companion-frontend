import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/UserService';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';
import Navbar from '../components/Navbar';
import LogoutButton from '../components/LogoutButton';

type ProfileNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Profile"
>


const ProfileScreen = () => {
    const { user } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const navigation = useNavigation<ProfileNavigationProp>();

    const isFormValid = () => {
      return (
        currentPassword && 
        newPassword &&
        currentPassword !== newPassword &&
        newPassword.length >= 8
      )
    }

    const handlePasswordChange = async () => {
        if (!user?.id) {
            Alert.alert("User ID missing. Please log in again.");
            return;
          }

        if(!currentPassword || !newPassword) {
            Alert.alert("Both current and new password is required.")
            return;
        }

        if(currentPassword === newPassword) {
            Alert.alert("New password can not be the same as the old.")
            return;
        }

        if(newPassword.length < 8) {
            Alert.alert("Password must be at least 8 characters long.");
            return;
        }

        try {
            await changePassword(user.id, { currentPassword, newPassword});
            Alert.alert("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err: any) {
            console.error('Error:', err.response?.data || err.message);
            Alert.alert(err.response?.data || 'Did you type in your current password correct?');
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <Navbar />
            <View style={Layout.container}>

            <Text style={Typography.title}>My Profile</Text>
            <Text style={Typography.label}>Email:</Text>
            <Text style={Typography.body}>{user?.email ?? 'Unknown'}</Text>
            <Text style={{ margin: 10 }}></Text>
            <Text style={[Typography.label, {marginBottom: 10, fontWeight: "bold"}]}>Change Password</Text>
            <Text style={Typography.label}>Current Password:</Text>
        <TextInput
            secureTextEntry
            style={Layout.input}
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={(value) => setCurrentPassword(value)}
        />

        <Text style={Typography.label}>New Password:</Text>
        <TextInput
            secureTextEntry
            style={Layout.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={(value) => setNewPassword(value)}
        />

        <TouchableOpacity style={[Layout.button, !isFormValid && {backgroundColor: "gray"}]} 
          onPress={handlePasswordChange}
          disabled={!isFormValid()}
        >
            <Text style={Layout.buttonText}>Update Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[Layout.button, {marginTop: 50}]} onPress={() => navigation.navigate("Home")} 
        >
            <Text style={Layout.buttonText}>Homescreen</Text>
        </TouchableOpacity>

        <LogoutButton />
        </View>
    </SafeAreaView>
    );
}

export default ProfileScreen;