import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';
import { changePassword, getUserDashboard, updateName } from '../services/UserService';
import { Layout } from '../styles/Layout';
import { useTypography } from '../styles/Typography';
import Navbar from '../components/Navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { ActivityIndicator } from 'react-native';
import Divider from '../components/Divider';
import { useAppTheme } from '../hooks/useAppTheme';
import * as SecureStore from 'expo-secure-store';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordChangeInput, passwordChangeSchema } from '../validation/profileValidation';
import { NameChangeInput, nameChangeSchema } from '../validation/userNameChangeValidation';
import NameChangeConfirmModal from '../components/NameChangeConfirmModal';
import PasswordChangeConfirmModal from '../components/PasswordChangeConfirmModal';
import { cacheHighestStreak, cacheRosaryStreak, getCachedHighestStreak, getCachedStreak } from '../services/CacheService';
import { UserDashboard } from '../models/UserDashboard';

type ProfileNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Profile"
>

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const pad = (n: number) => n.toString().padStart(2, "0");
  
    return (
      date.getFullYear() +
      "-" + pad(date.getMonth() + 1) +
      "-" + pad(date.getDate()) +
      " " + pad(date.getHours()) +
      ":" + pad(date.getMinutes()) +
      ":" + pad(date.getSeconds())
    );
};

const ProfileScreen = () => {
    const { user, setUser } = useAuth();
    const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
    const [loadingDashboard, setLoadingDashboard] = useState(true);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [isNameLoading, setIsNameLoading] = useState(false);    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isConfirmNameVisible, setIsConfirmNameVisible] = useState(false);

    const isOAuthUser = user?.email?.toLowerCase().endsWith("@gmail.com");
    const navigation = useNavigation<ProfileNavigationProp>();
    const theme = useAppTheme();
    const Typography = useTypography();

    if(!user) {
        return null;
    }
    
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

            const updatedUser = await updateName(user?.id, payload);

            const newUser = {
                ...user,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
            };

            await SecureStore.setItemAsync("user", JSON.stringify(newUser))
            setUser?.(newUser);

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
        const loadDashboard = async () => {
            try {
                const data = await getUserDashboard();
                setDashboard(data);
                setCurrentStreak(data.currentStreak);
                setHighestStreak(data.highestStreak);

                await cacheRosaryStreak(data.currentStreak);
                await cacheHighestStreak(data.highestStreak);
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoadingDashboard(false);
            }
        };
        loadDashboard();
    }, [user])

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

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.navbar}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView keyboardShouldPersistTaps="handled" style={{backgroundColor: theme.auth.background}}>
                <Navbar />
                <View style={Layout.container}>
                <Text style={[Typography.title, {textAlign: "center", fontWeight: "600", color: theme.auth.text}]}>My Profile</Text>
                <Divider />
                <View style={{ marginTop: 10}}>
                    <Text style={[Typography.label, {fontWeight: 'bold', marginBottom: 10, color: theme.auth.text }]}>User Info</Text>
                    <View style={{flexDirection: "row", marginVertical: 5}}>
                        <Text style={[Typography.italic, {color: theme.auth.text}]}>
                            Name: <Text style={[Typography.italic, {color: theme.auth.text}]}>{`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}</Text> 
                        </Text>
                    </View>
                    <View style={{flexDirection: "row", marginVertical: 5}}>
                        <Text style={[Typography.italic, {color: theme.auth.text}]}>
                            Email: <Text style={[Typography.italic, {color: theme.auth.text}]}>{user?.email ?? 'Unknown'}</Text>
                        </Text>
                    </View>
                    <View style={{flexDirection: "row", marginVertical: 5}}> 
                        <Text style={[Typography.italic, {color: theme.auth.text}]}>
                            Account created: <Text style={[Typography.italic, {color: theme.auth.text}]}>{user?.createdAt ?? 'Unknown'}</Text> 
                        </Text> 
                    </View> 
                    <View style={{flexDirection: "row", marginVertical: 5}}> 
                        <Text style={[Typography.italic, {color: theme.auth.text}]}>
                            Account updated: <Text style={[Typography.italic, {color: theme.auth.text}]}>{user?.updatedAt ?? 'Unknown'}</Text>
                        </Text> 
                    </View>
                </View>

                <View style={{ marginTop: 20, borderTopWidth: 1, borderColor: theme.auth.text, paddingTop: 10 }}>
                    <Text style={[Typography.label, {fontWeight: 'bold', marginBottom: 10, color: theme.auth.text }]}>Dashboard</Text>
                    {loadingDashboard ? (
                        <ActivityIndicator color={theme.auth.text} />
                    ) : dashboard ? (
                        <>
                            <Text style={[Typography.italic, { color: theme.auth.text, marginVertical: 5 }]}>
                                Rosaries Prayed: <Text style={[Typography.italic, {color: theme.auth.text}]}>{dashboard.rosaryLogCount}</Text>
                            </Text>
                    
                            <Text style={[Typography.italic, { color: theme.auth.text, marginVertical: 5 }]}>
                                Current Streak: <Text style={[Typography.italic, {color: theme.auth.text}]}>{dashboard.currentStreak}</Text>
                            </Text>

                            <Text style={[Typography.italic, { color: theme.auth.text, marginVertical: 5 }]}>
                                Highest Streak: <Text style={[Typography.italic, {color: theme.auth.text}]}>{dashboard.highestStreak}</Text>
                            </Text>

                            <Text style={[Typography.italic, { color: theme.auth.text, marginVertical: 5 }]}>
                                Journal Entries: <Text style={[Typography.italic, {color: theme.auth.text}]}>{dashboard.journalEntryCount}</Text>
                            </Text>

                            <Text style={[Typography.italic, { color: theme.auth.text, marginVertical: 5 }]}>
                                Feedback Submitted: <Text style={[Typography.italic, {color: theme.auth.text}]}>{dashboard.feedbackCount}</Text>
                            </Text>
                        </>
                    ) : (
                        <Text style={{ color: theme.auth.text }}>Unable to load dashboard.</Text>
                    )}
                </View>

                {!loadingDashboard && dashboard?.recentFeedbacks?.content && dashboard.recentFeedbacks.content.length > 0 ? (
                    <View style={{ marginTop: 20, borderTopWidth: 1, borderColor: theme.auth.text, paddingTop: 10 }}>
                        <Text style={[Typography.label, { fontWeight: "bold", marginBottom: 10, color: theme.auth.text }]}>
                            Recent Feedback Submitted
                        </Text>

                        {dashboard.recentFeedbacks.content.map((fb) => (
                            <View 
                                key={fb.id} 
                                style={{
                                    backgroundColor: theme.auth.background,
                                    padding: 12,
                                    borderRadius: 8,
                                    marginBottom: 10,
                                    shadowColor: theme.auth.text,
                                    shadowRadius: 2
                                }}
                            >
                                <Text style={[Typography.italic, { color: theme.auth.text, marginBottom: 5 }]}>
                                    {fb.submittedAt ? formatDateTime(fb.submittedAt) : 'Unknown date'}
                                </Text>

                                <Text style={[Typography.italic, { color: theme.auth.text }]}>
                                    {fb.message}
                                </Text>
                            </View>
                        ))}
                    </View>
                )   :   (
                    <Text style={[Typography.italic, { color: theme.auth.smallText, marginTop: 10 }]}>
                        No recent feedback submitted yet.
                    </Text>
                )}

                <View style={{ marginTop: 20, borderTopWidth: 1, borderColor: theme.auth.text, paddingTop: 10 }}>
                    <Text style={[Typography.label, {fontWeight: 'bold', marginBottom: 10, color: theme.auth.text }]}>Name Change</Text>
                    <Text style={[Typography.italic, {color: theme.auth.text, marginBottom: 5}]}>Current Firstname:</Text>
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

                    <Text style={[Typography.italic, {color: theme.auth.text, marginBottom: 5}]}>New Firstname:</Text>
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

                    <Text style={[Typography.italic, {color: theme.auth.text, marginBottom: 5}]}>Current Lastname:</Text>
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

                    <Text style={[Typography.italic, {color: theme.auth.text, marginBottom: 5}]}>New Lastname:</Text>
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

                    <TouchableOpacity style={[Layout.button, {backgroundColor: theme.auth.navbar, opacity: isNameLoading ? 0.7 : 1, marginTop: 20, marginBottom: 10}]}
                        disabled={isNameLoading}
                        onPress={() => setIsConfirmNameVisible(true)}
                    >
                        {isNameLoading ? (
                            <ActivityIndicator color={theme.auth.text} />
                        ) : (
                            <Text style={[Typography.label, {color: theme.auth.text}]}>Update Name</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {!isOAuthUser && (
                    <View style={{ marginTop: 20, borderTopWidth: 1, borderColor: theme.auth.text, paddingTop: 10 }}>
                        <Text style={[Typography.label, {textAlign: "center", color: theme.auth.text}]}>Password Change</Text>
                        <Text style={[Typography.italic, {color: theme.auth.text, marginBottom: 5}]}>Current Password:</Text>
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

                        <Text style={[Typography.italic, {color: theme.auth.text, marginBottom: 5}]}>New Password:</Text>
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
                            
                        <Text style={[Typography.italic, {color: theme.auth.text, marginBottom: 5}]}>Confirm New Password:</Text>
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

                        <TouchableOpacity style={[Layout.button, {opacity: isPasswordLoading ? 0.7 : 1, marginTop: 20, marginBottom: 10}]} 
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
                    <View style={{ marginTop: 20, borderTopWidth: 1, borderColor: theme.auth.text, paddingTop: 10 }}>
                        <Text style={[Typography.label, {fontWeight: 'bold', marginBottom: 10, color: theme.auth.text }]}>Password Change</Text>
                        <Text style={[Typography.italic, { color: theme.auth.smallText}]}>
                            Password changes cannot be managed through the app for Google-sign-in accounts because we don’t store your password.                        
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