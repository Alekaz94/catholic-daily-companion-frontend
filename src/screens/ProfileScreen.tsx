import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/UserService';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';
import Navbar from '../components/Navbar';
import LogoutButton from '../components/LogoutButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { ActivityIndicator } from 'react-native';
import { AppTheme, Colors } from '../styles/colors';

type ProfileNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Profile"
>

const ProfileScreen = () => {
    const { user } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const isOAuthUser = user?.email?.toLowerCase().endsWith("@gmail.com");
    const navigation = useNavigation<ProfileNavigationProp>();

    const isFormValid = () => {
      return (
        currentPassword && 
        newPassword &&
        confirmNewPassword &&
        currentPassword !== newPassword &&
        newPassword.length >= 8 &&
        newPassword === confirmNewPassword
      )
    }

    const handlePasswordChange = async () => {
        if (!user?.id) {
            Toast.show("User ID missing. Please log in again.", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
            });
            return;
        }

        if(!currentPassword || !newPassword) {
            Toast.show("Both current and new password is required.", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
            });
            return;
        }

        if(currentPassword === newPassword) {
            Toast.show("New password can not be the same as the old.", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
            });
            return;
        }

        if(newPassword.length < 8) {
            Toast.show("Password must be at least 8 characters long.", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
            });
            return;
        }

        if(newPassword !== confirmNewPassword) {
            Toast.show("Confirm password must match new password.", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
            });
            return;
        }

        try {
            setIsLoading(true);

            await changePassword(user.id, { currentPassword, newPassword});

            Toast.show('Password updated successfully!', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
            });

            setTimeout(() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            }, 0);
        } catch (err: any) {
            Toast.show("Something went wrong.  Please check your current password.", {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#FAF3E0"}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView keyboardShouldPersistTaps="handled" style={{backgroundColor: AppTheme.auth.background}}>
                <Navbar />
                <View style={Layout.container}>
                <Text style={[Typography.title, {textAlign: "center"}]}>My Profile</Text>

                <View style={{marginVertical: 20}}>
                    <View style={{flexDirection: "row"}}>
                        <Text style={Typography.body}>Name: </Text>
                        <Text style={[Typography.body, {color: "black", fontWeight: "500"}]}>{`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}</Text>
                    </View>
                    <View style={{flexDirection: "row", marginTop: 5}}>
                        <Text style={Typography.body}>Email: </Text>
                        <Text style={[Typography.body, {color: "black", fontWeight: "500"}]}>{user?.email ?? 'Unknown'}</Text>
                    </View>
                </View>
                
                {!isOAuthUser && (
                    <>
                        <Text style={[Typography.label, {marginBottom: 10, fontWeight: "bold"}]}>Change Password</Text>
                        <Text style={Typography.label}>Current Password:</Text>
                        <View style={{ position: 'relative' }}>
                            <TextInput
                                secureTextEntry={!showCurrentPassword}
                                style={Layout.input}
                                placeholder="Current Password"
                                value={currentPassword}
                                accessibilityLabel="Current Password"
                                onChangeText={(value) => setCurrentPassword(value)}
                            />
                            <TouchableOpacity
                                style={{ position: 'absolute', right: 16, top: 10 }}
                                onPress={() => setShowCurrentPassword(prev => !prev)}
                            >
                                <Ionicons name={showCurrentPassword ? "eye-off" : "eye"} size={22} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <Text style={Typography.label}>New Password:</Text>
                        <View style={{ position: 'relative'}}>
                            <TextInput
                                secureTextEntry={!showNewPassword}
                                style={[Layout.input, {marginBottom: 2}]}
                                placeholder="New Password"
                                value={newPassword}
                                accessibilityLabel="New Password"
                                onChangeText={(value) => setNewPassword(value)}
                            />
                            <TouchableOpacity
                                style={{ position: 'absolute', right: 16, top:10 }}
                                onPress={() => setShowNewPassword(prev => !prev)}
                            >
                                <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={22} color="gray" />                            
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12, color: 'gray', marginTop: 2, marginBottom: 15, fontStyle: 'italic' }}>
                                Password must be at least 8 characters. Make sure it's something secure.
                            </Text>
                        </View>
                            
                        <Text style={Typography.label}>Confirm New Password:</Text>
                        <View style={{ position: 'relative' }}>
                            <TextInput 
                                secureTextEntry={!showConfirmNewPassword}
                                style={[Layout.input, {marginBottom: 2}]}
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                accessibilityLabel="Confirm New Password"
                                onChangeText={(value) => setConfirmNewPassword(value)}
                            />
                            <TouchableOpacity
                                style={{ position: 'absolute', right: 16, top: 10 }}
                                onPress={() => setShowConfirmNewPassword(prev => !prev)}
                            >
                                <Ionicons name={showConfirmNewPassword ? "eye-off" : "eye"} size={22} color="gray" />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12, color: 'gray', marginTop: 2, marginBottom: 15, fontStyle: 'italic' }}>
                                Confirm password must match new password
                            </Text>
                        </View>

                        <TouchableOpacity style={[Layout.button, {backgroundColor: isFormValid() ? "#FAF3E0" : "gray", borderWidth: isFormValid() ? 1 : 0, opacity: isLoading ? 0.7 : 1, marginTop: 30}]} 
                            onPress={() => setIsConfirmVisible(true)}
                            disabled={!isFormValid()}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <Text style={[Layout.buttonText, {color: "black"}]}>Update Password</Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}

                {isOAuthUser && (
                    <Text style={[Typography.label, { color: 'gray', marginVertical: 20, fontSize: 18, textAlign: "center" }]}>
                        Password changes are managed through your Google account.
                    </Text>
                )}

                <LogoutButton />
                </View>
            </ScrollView>
            </TouchableWithoutFeedback>

            <Modal
                animationType="fade"
                transparent
                visible={isConfirmVisible}
                onRequestClose={() => setIsConfirmVisible(false)}
            >
             <View style={[Layout.container, {width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.4)'}]}>
                <View style={{alignItems: "center", padding: 20, width: "100%", backgroundColor: Colors.surface, borderRadius: 12, borderColor: "black", borderWidth: 1}}>
                    <Text style={Typography.title}>Are you sure you want to update your password?</Text>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            style={[Layout.button, {backgroundColor: Colors.success, width: "30%", marginRight: 40, borderWidth: 1}]}
                            onPress={handlePasswordChange}
                        >
                            <Text style={[Layout.buttonText, {color: "black"}]}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Layout.button, {backgroundColor: Colors.error, width: "30%", borderWidth: 1}]}
                            onPress={() => setIsConfirmVisible(false)}
                        >
                            <Text style={[Layout.buttonText, {color: "black"}]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        </SafeAreaView>
    );
}

export default ProfileScreen;