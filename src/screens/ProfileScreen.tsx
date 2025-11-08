import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';
import { changePassword, updateName } from '../services/UserService';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';
import Navbar from '../components/Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { ActivityIndicator } from 'react-native';
import Divider from '../components/Divider';
import { useAppTheme } from '../hooks/useAppTheme';
import * as SecureStore from 'expo-secure-store';
import { getStreak } from '../services/RosaryService';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordChangeInput, passwordChangeSchema } from '../validation/profileValidation';
import { NameChangeInput, nameChangeSchema } from '../validation/userNameChangeValidation';
import NameChangeConfirmModal from '../components/NameChangeConfirmModal';
import PasswordChangeConfirmModal from '../components/PasswordChangeConfirmModal';

type ProfileNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Profile"
>

const ProfileScreen = () => {
    const { user } = useAuth();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [isNameLoading, setIsNameLoading] = useState(false);    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isConfirmNameVisible, setIsConfirmNameVisible] = useState(false);
    const [streak, setStreak] = useState<number>(0);
    const [highestStreak, setHighestStreak] = useState<number>(0);
    const isOAuthUser = user?.email?.toLowerCase().endsWith("@gmail.com");
    const navigation = useNavigation<ProfileNavigationProp>();
    const theme = useAppTheme();

    const {
        handleSubmit: nameChangeSubmit,
        control: nameChangeControl,
        formState: { errors: nameChangeErrors, isSubmitting: nameChangeIsSubmitting},
        reset: nameChangeReset
    } = useForm<NameChangeInput>({
        resolver: zodResolver(nameChangeSchema)
    })

    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset
    } = useForm<PasswordChangeInput>({
        resolver: zodResolver(passwordChangeSchema)
    });

    const handleUpdateName = async (data: NameChangeInput) => {
        if(!user) {
            return;
        }

        try {
            setIsNameLoading(true);

            const payload = {
                firstName: data.newFirstName?.trim() || undefined,
                lastName: data.newLastName?.trim() || undefined,
            };

            await updateName(user?.id, payload);
            Toast.show("Name changed successfully!", {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM
            });
            nameChangeReset({
                currentFirstName: user.firstName ?? "",
                currentLastName: user.lastName ?? "",
                newFirstName: "",
                newLastName: "",
            });
            setIsConfirmNameVisible(false);
        } catch (error: any) {
            Toast.show(error.response?.data || 'Something went wrong!', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
                backgroundColor: 'red',
                textColor: 'white',
            });
        } finally {
            setIsNameLoading(false)
        }
    }

    const onSubmit = async (data: PasswordChangeInput) => {
        if(!user) {
            return;
        }

        try {
            setIsPasswordLoading(true);
            await changePassword(user?.id, data)
            Toast.show("Password changed successfully!", {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
            });
            reset({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmNewPassword(false);
            setIsConfirmVisible(false);
        } catch (err: any) {
            Toast.show(err.response?.data || 'Something went wrong!', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
                backgroundColor: 'red',
                textColor: 'white',
            });
        } finally {
            setIsPasswordLoading(false)
        }
    }

    useEffect(() => {
        if(user) {
            nameChangeReset({
                currentFirstName: user.firstName ?? "",
                currentLastName: user.lastName ?? "",
                newFirstName: "",
                newLastName: "",
            });
        }
    }, [user, nameChangeReset]);

    useEffect(() => {
        const fetchStreak = async () => {
            if(user) {
                try {
                    const currentStreak = await getStreak(user.id);
                    setStreak(currentStreak);
                    
                    const storedHighest = await SecureStore.getItemAsync("streak");
                    const highest = storedHighest ? parseInt(storedHighest) : 0;

                    if(currentStreak > highest) {
                        await SecureStore.setItemAsync("streak", currentStreak.toString());
                        setHighestStreak(currentStreak);
                    } else {
                        setHighestStreak(highest);
                    }
                } catch (error) {
                    console.error("Could not retrieve rosary streak for user", error);
                }
            }
        }

        fetchStreak();
    }, [user])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.navbar}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView keyboardShouldPersistTaps="handled" style={{backgroundColor: theme.auth.background}}>
                <Navbar />
                <View style={Layout.container}>
                <Text style={[Typography.italic, {textAlign: "center", fontSize: 22, fontWeight: "600", color: theme.auth.text}]}>My Profile</Text>
                <Divider />
                <View style={{marginVertical: 15}}>
                    <Text style={[Typography.italic, {textAlign: "center", fontSize: 20, color: theme.auth.text}]}>User Info</Text>
                    <Divider />
                    <View style={{flexDirection: "row", marginVertical: 5}}>
                        <Text style={[Typography.body, {color: theme.auth.text}]}>Name: </Text>
                        <Text style={[Typography.body, {fontWeight: "500", color: theme.auth.text}]}>{`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}</Text>
                    </View>
                    <View style={{flexDirection: "row", marginVertical: 5}}>
                        <Text style={[Typography.body, {color: theme.auth.text}]}>Email: </Text>
                        <Text style={[Typography.body, {fontWeight: "500", color: theme.auth.text}]}>{user?.email ?? 'Unknown'}</Text>
                    </View>
                    <View style={{flexDirection: "row", marginVertical: 5}}> 
                        <Text style={[Typography.body, {color: theme.auth.text}]}>Account created: </Text> 
                        <Text style={[Typography.body, {fontWeight: "500", color: theme.auth.text}]}>{user?.createdAt ?? 'Unknown'}</Text> 
                    </View> 
                    <View style={{flexDirection: "row", marginVertical: 5}}> 
                        <Text style={[Typography.body, {color: theme.auth.text}]}>Account updated: </Text> 
                        <Text style={[Typography.body, {fontWeight: "500", color: theme.auth.text}]}>{user?.updatedAt ?? 'Unknown'}</Text> 
                    </View>
                </View>

                <View style={{marginVertical: 15}}>
                    <Text style={[Typography.italic, {textAlign: "center", fontSize: 20, color: theme.auth.text}]}>Rosary Info</Text>
                    <Divider />
                    <View style={{flexDirection: "row", marginVertical: 5}}>
                        <Text style={[Typography.body, {color: theme.auth.text}]}>Highest prayed rosary streak: </Text>
                        <Text style={[Typography.body, {fontWeight: "500", color: theme.auth.text}]}>{highestStreak}</Text>
                    </View>
                    <View style={{flexDirection: "row", marginVertical: 5}}>
                        <Text style={[Typography.body, {color: theme.auth.text}]}>Current prayed streak: </Text>
                        <Text style={[Typography.body, {fontWeight: "500", color: theme.auth.text}]}>{streak}</Text>
                    </View>
                </View>

                <View style={{marginVertical: 15}}>
                    <Text style={[Typography.italic, {textAlign: "center", fontSize: 20, color: theme.auth.text}]}>Name Change</Text>
                    <Divider />
                    <Text style={[Typography.label, {color: theme.auth.text}]}>Current Firstname:</Text>
                    <View style={{ position: 'relative' }}>
                        <Controller
                            control={nameChangeControl}
                            name='currentFirstName'
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[Layout.input, { backgroundColor: theme.auth.inputDisabled, color: theme.auth.disabledText, borderColor: theme.auth.disabledText }]}
                                    placeholder='Current Firstname'
                                    placeholderTextColor={theme.auth.disabledText}
                                    value={value}
                                    onChangeText={onChange}
                                    accessibilityLabel="Current Firstname"
                                    editable={false}
                                />
                            )}
                        />
                    </View>
                    {nameChangeErrors.currentFirstName && <Text style={{color: "red", marginTop: -10, marginBottom: 15 }}>{nameChangeErrors.currentFirstName.message}</Text>}

                    <Text style={[Typography.label, {color: theme.auth.text}]}>New Firstname:</Text>
                    <View style={{ position: 'relative' }}>
                        <Controller
                            control={nameChangeControl}
                            name='newFirstName'
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={Layout.input}
                                    placeholder='New Firstname'
                                    value={value}
                                    onChangeText={onChange}
                                    accessibilityLabel="New Firstname"
                                    editable={!nameChangeIsSubmitting}
                                />
                            )}
                        />
                    </View>
                    {nameChangeErrors.newFirstName && <Text style={{color: "red", marginTop: -10, marginBottom: 15 }}>{nameChangeErrors.newFirstName.message}</Text>}

                    <Text style={[Typography.label, {color: theme.auth.text}]}>Current Lastname:</Text>
                    <View style={{ position: 'relative' }}>
                        <Controller
                            control={nameChangeControl}
                            name='currentLastName'
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[Layout.input, { backgroundColor: theme.auth.inputDisabled, color: theme.auth.disabledText, borderColor: theme.auth.disabledText, }]}
                                    placeholder='Current Lastname'
                                    placeholderTextColor={theme.auth.disabledText}
                                    value={value}
                                    onChangeText={onChange}
                                    accessibilityLabel="Current Lastname"
                                    editable={false}
                                />
                            )}
                        />
                    </View>
                    {nameChangeErrors.currentLastName && <Text style={{color: "red", marginTop: -10, marginBottom: 15 }}>{nameChangeErrors.currentLastName.message}</Text>}

                    <Text style={[Typography.label, {color: theme.auth.text}]}>New Lastname:</Text>
                    <View style={{ position: 'relative' }}>
                        <Controller
                            control={nameChangeControl}
                            name='newLastName'
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={Layout.input}
                                    placeholder='New Lastname'
                                    value={value}
                                    onChangeText={onChange}
                                    accessibilityLabel="New Lastname"
                                    editable={!nameChangeIsSubmitting}
                                />
                            )}
                        />
                    </View>
                    {nameChangeErrors.newLastName && <Text style={{color: "red", marginTop: -10, marginBottom: 15 }}>{nameChangeErrors.newLastName.message}</Text>}

                    <TouchableOpacity style={[Layout.button, {backgroundColor: theme.auth.navbar, opacity: isNameLoading ? 0.7 : 1, marginTop: 30}]}
                        disabled={isNameLoading}
                        onPress={() => setIsConfirmNameVisible(true)}
                    >
                        {isNameLoading ? (
                            <ActivityIndicator color={theme.auth.text} />
                        ) : (
                            <Text style={[Layout.buttonText, {color: theme.auth.text}]}>Update Name</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {!isOAuthUser && (
                    <View style={{marginVertical: 15}}>
                        <Text style={[Typography.italic, {textAlign: "center", fontSize: 20, color: theme.auth.text}]}>Password Change</Text>
                        <Divider />
                        <Text style={[Typography.label, {color: theme.auth.text}]}>Current Password:</Text>
                        <View style={{ position: 'relative' }}>
                            <Controller
                                control={control}
                                name='currentPassword'
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        secureTextEntry={!showCurrentPassword}
                                        style={Layout.input}
                                        placeholder="Current Password"
                                        value={value}
                                        accessibilityLabel="Current Password"
                                        onChangeText={onChange}
                                        editable={!isSubmitting}
                                    />
                                )}
                            />
                            <TouchableOpacity
                                style={{ position: 'absolute', right: 16, top: 10 }}
                                onPress={() => setShowCurrentPassword(prev => !prev)}
                            >
                                <Ionicons name={showCurrentPassword ? "eye-off" : "eye"} size={22} color="gray" />
                            </TouchableOpacity>
                        </View>
                        {errors.currentPassword && <Text style={{color: "red", marginTop: -10, marginBottom: 15 }}>{errors.currentPassword.message}</Text>}

                        <Text style={[Typography.label, {color: theme.auth.text}]}>New Password:</Text>
                        <View style={{ position: 'relative'}}>
                            <Controller
                                control={control}
                                name='newPassword'
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        secureTextEntry={!showNewPassword}
                                        style={[Layout.input, {marginBottom: 2}]}
                                        placeholder="New Password"
                                        value={value}
                                        accessibilityLabel="New Password"
                                        onChangeText={onChange}
                                        editable={!isSubmitting}
                                    />
                                )}
                            />
                            <TouchableOpacity
                                style={{ position: 'absolute', right: 16, top:10 }}
                                onPress={() => setShowNewPassword(prev => !prev)}
                            >
                                <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={22} color="gray" />                            
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12, color: theme.auth.smallText, marginTop: 2, marginBottom: 15, fontStyle: 'italic' }}>
                                Password must be at least 8 characters. Make sure it's something secure.
                            </Text>
                        </View>
                        {errors.newPassword && <Text style={{color: "red", marginTop: -10, marginBottom: 15 }}>{errors.newPassword.message}</Text>}
                            
                        <Text style={[Typography.label, {color: theme.auth.text}]}>Confirm New Password:</Text>
                        <View style={{ position: 'relative' }}>
                            <Controller
                                control={control}
                                name='confirmNewPassword'
                                render={({ field: { onChange, value } }) => (
                                    <TextInput 
                                        secureTextEntry={!showConfirmNewPassword}
                                        style={[Layout.input, {marginBottom: 2}]}
                                        placeholder="Confirm New Password"
                                        value={value}
                                        accessibilityLabel="Confirm New Password"
                                        onChangeText={onChange}
                                        editable={!isSubmitting}
                                    />
                                )}
                            />
                            <TouchableOpacity
                                style={{ position: 'absolute', right: 16, top: 10 }}
                                onPress={() => setShowConfirmNewPassword(prev => !prev)}
                            >
                                <Ionicons name={showConfirmNewPassword ? "eye-off" : "eye"} size={22} color="gray" />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12, color: theme.auth.smallText, marginTop: 2, marginBottom: 15, fontStyle: 'italic' }}>
                                Confirm password must match new password
                            </Text>
                        </View>
                        {errors.confirmNewPassword && <Text style={{color: "red", marginTop: -10, marginBottom: 15 }}>{errors.confirmNewPassword.message}</Text>}

                        <TouchableOpacity style={[Layout.button, {opacity: isPasswordLoading ? 0.7 : 1, marginTop: 30}]} 
                            disabled={isPasswordLoading}
                            onPress={() => setIsConfirmVisible(true)}
                        >
                            {isPasswordLoading ? (
                                <ActivityIndicator color={theme.auth.text} />
                            ) : (
                                <Text style={[Layout.buttonText, {color: theme.auth.text}]}>Update Password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {isOAuthUser && (
                    <View style={{marginVertical: 15}}>
                        <Text style={[Typography.italic, {textAlign: "center", fontSize: 20, color: theme.auth.text}]}>Password Change</Text>
                        <Divider />
                        <Text style={[Typography.label, { color: theme.auth.smallText, fontSize: 18, textAlign: "center", marginVertical: 5}]}>
                            Password changes are managed through your Google account.
                        </Text>
                    </View>
                )}
                </View>
            </ScrollView>
            </TouchableWithoutFeedback>

        <PasswordChangeConfirmModal
            visible={isConfirmVisible}
            onClose={() => setIsConfirmVisible(false)}
            onConfirm={handleSubmit(onSubmit)}
            isLoading={isPasswordLoading}
        />

        <NameChangeConfirmModal
            visible={isConfirmNameVisible}
            onClose={() => setIsConfirmNameVisible(false)}
            onConfirm={nameChangeSubmit(handleUpdateName)}
            isLoading={isNameLoading}
        />
        </SafeAreaView>
    );
}

export default ProfileScreen;