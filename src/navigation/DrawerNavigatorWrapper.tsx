import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import * as DrawerLayout from 'react-native-drawer-layout';
import AppNavigator from './AppNavigation';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { DrawerProvider } from '../context/DrawerContext';
import Divider from '../components/Divider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

type DrawerNavigationWrapperProp = NativeStackNavigationProp<AuthStackParamList>;

const DrawerNavigatorWrapper = () => {
    const navigation = useNavigation<DrawerNavigationWrapperProp>();
    const theme = useAppTheme();
    const { isDark } = useTheme();
    const { user, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { icon: 'home', label: 'Home' },
        { icon: 'person-circle', label: 'Profile' },
        { icon: 'settings', label: 'Settings' },
        { icon: 'document-text', label: 'Privacy Policy' },
        { icon: 'chatbubble-ellipses', label: 'Feedback' },
    ] as const;

    const openDrawer = () => setIsOpen(true);
    const closeDrawer = () => setIsOpen(false);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await logout();
        } finally {
            setIsLoading(false);
        }
    }

    const renderDrawerContent = () => {
        return (
            <View style={{flex: 1}}> 
                <View style={{padding: 20, paddingTop: 50, alignItems: 'center', backgroundColor: theme.auth.background, borderBottomWidth: 1, borderBlockColor: theme.auth.text}}> 
                    <Text style={{marginTop: 18, fontSize: 18}}> {user && user.firstName || "Welcome"} </Text> 
                </View> 

                <View style={{ flex: 1, justifyContent: "space-between", paddingHorizontal: 20 }}>
                    <View style={{marginTop: 20, backgroundColor: theme.auth.background}}>
                        {menuItems.map(({ icon, label }) => (
                            <View key={label} style={{backgroundColor: theme.auth.background}}>
                                <TouchableOpacity 
                                    key={label}
                                    onPress={() => {
                                        closeDrawer();
                                        navigation.navigate(label)
                                    }}
                                    style={{flexDirection: "row", alignItems: "center", paddingVertical: 15,}}
                                >
                                    <Ionicons
                                        name={isDark ? `${icon}-outline` : icon}
                                        size={24}
                                        color={theme.auth.text}
                                        style={{ marginRight: 20 }}
                                    />
                                    <Text style={{ fontSize: 16, color: theme.auth.text}}>{label}</Text>
                                </TouchableOpacity>
                                <Divider />
                            </View>
                        ))}
                    </View>

                    <View style={{ paddingBottom: 20, borderTopWidth: 1, borderTopColor: theme.auth.text }}>
                    {isLoading ? (
                        <ActivityIndicator color={theme.auth.text} />
                    ) : (
                        <View>
                            <TouchableOpacity  
                                onPress={() => {
                                    handleLogout();
                                    closeDrawer();
                                }}
                                style={{flexDirection: "row", alignItems: "center", paddingVertical: 15}}
                            >
                                <Ionicons name={isDark ? "log-out-outline" : "log-out"} size={24} color={theme.auth.text} style={{marginRight: 20}} />
                                <Text style={{color: theme.auth.text, fontSize: 16}}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    </View>
                </View>
            </View>
        )
    }

    return (
        <DrawerProvider openDrawer={openDrawer}>
          <DrawerLayout.Drawer
            open={isOpen}
            onOpen={openDrawer}
            onClose={closeDrawer}
            renderDrawerContent={renderDrawerContent}
            drawerStyle={{ backgroundColor: theme.auth.background, width: 260, paddingVertical: 20, paddingHorizontal: 15 }}
          >
            <AppNavigator />
          </DrawerLayout.Drawer>
        </DrawerProvider>
    );
}

export default DrawerNavigatorWrapper;