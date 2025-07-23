import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/UserService';

type ProfileNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Profile"
>


const ProfileScreen = () => {
    const { user } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const navigation = useNavigation<ProfileNavigationProp>();

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
        <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email ?? 'Unknown'}</Text>

        <Text style={styles.label}>Change Password</Text>
        <Text style={styles.label}>Current Password:</Text>
        <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={(value) => setCurrentPassword(value)}
        />

        <Text style={styles.label}>New Password:</Text>
        <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={(value) => setNewPassword(value)}
        />

        <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
            <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 24,
      alignSelf: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 12,
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      color: '#333',
      marginBottom: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
      marginBottom: 12,
    },
    button: {
      backgroundColor: '#6200ee',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default ProfileScreen;