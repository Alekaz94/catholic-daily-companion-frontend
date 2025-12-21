import { View, Text, Switch, ScrollView, TouchableOpacity, Alert, Platform } from "react-native"; 
import { useAppTheme } from "../hooks/useAppTheme"; 
import { useTheme } from "../context/ThemeContext"; 
import { useTypography } from "../styles/Typography"; 
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
import RNFS from "react-native-fs";
import { downloadUserDataJson, downloadUserDataZip } from "../services/UserExportService";
import { Buffer } from "buffer";
import * as Sharing from "expo-sharing";
import { clearAllCache } from "../services/CacheService";
import { useRequireAuth } from "../hooks/useRequireAuth";
import * as Application from 'expo-application';

const SettingsScreen = () => { 
    const user = useRequireAuth();
    const theme = useAppTheme();
    const [version, setVersion] = useState<string | null>(null);

    if(!user) {
        return null;
    }
    
    const { themeMode, setThemeMode, isDark, setFontSize, setFontStyle, fontSize, fontStyle } = useTheme();
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const {logout} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const Typography = useTypography();

    useEffect(() => {
        setVersion(Application.nativeApplicationVersion)
    }, [user])

    const toggleDarkMode = () => {
        const current = themeMode === "system" ? (isDark ? "dark" : "light") : themeMode;
    
        setThemeMode(current === "dark" ? "light" : "dark");
    };

    const handleExportData = async (type: "json" | "zip") => {
        if(!user?.id) {
            return;
        }

        try {
            setIsLoading(true);

            // Download data
            const data = 
                type === "zip"
                    ? await downloadUserDataZip(user.id)
                    : await downloadUserDataJson(user.id);
            
            const fileName = type === "zip" ? "user-data-export.zip" : "user-data-export.json";

            const folderPath = Platform.OS === "android" 
                ? RNFS.DownloadDirectoryPath 
                : RNFS.DocumentDirectoryPath;

            const path = `${folderPath}/${fileName}`;
            
            // Convert ArrayBuffer to Base64
            const base64Data = Buffer.from(data).toString("base64");

            // Write file
            await RNFS.writeFile(path, base64Data, "base64");

            // Check if file exists
            const exists = await RNFS.exists(path);
            console.log("File exists:", exists)

            if(!exists) {
                Alert.alert("Error", "Failed to save the file.");
                return;
            }

            // Open file automatically
            const canShare = await Sharing.isAvailableAsync();
            if(canShare) {
                const fileUri = Platform.OS === "android" ? `file://${path}` : path
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert("Download Complete", `File saved to: ${path}`);
            }
        } catch (error) {
            console.error("Export failed", error);
            Alert.alert("Error", "Failed to download user data.");
        } finally {
            setIsLoading(false);
        }
    }

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
                    <Text style={[Typography.title, {textAlign: "center", fontWeight: "600", color: theme.auth.text}]}>Settings</Text> 
                    <Divider /> 

                    <View>
                        <Text style={[Typography.label, { fontWeight: 'bold', marginBottom: 10, color: theme.auth.text }]}> 
                            App info
                        </Text>
                        <Text style={[Typography.body, { color: theme.auth.text}]}>
                            Version: {version}
                        </Text>
                    </View>

                    <View style={{ marginTop: 20, borderTopWidth: 1, borderColor: theme.auth.text, paddingTop: 10 }}>
                        <Text style={[Typography.label, { fontWeight: 'bold', marginBottom: 10, color: theme.auth.text }]}> 
                            Appearance
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20}}> 
                            <Text style={[Typography.body, { color: theme.auth.text, marginRight: 10,}]}>
                                Dark Mode
                            </Text>
                            <Switch
                                value={isDark}
                                onValueChange={toggleDarkMode}
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isDark ? "#59512e" : '#FAF3E0'}
                            />
                        </View> 

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            <Text style={[Typography.body, { color: theme.auth.text, marginRight: 15}]}>Font Size</Text>
                            <TouchableOpacity onPress={() => {
                                const nextSize = fontSize === "small" ? "medium" : fontSize === "medium" ? "large" : "small";
                                setFontSize(nextSize);
                                }}
                            >
                                <Text style={{ color: theme.auth.text }}>{fontSize}</Text>
                            </TouchableOpacity>
                            <Text style={{ color: theme.auth.text, fontSize: 14, marginLeft: 10 }}>
                                ← Tap to toggle font size
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            <Text style={[Typography.body, { color: theme.auth.text, marginRight: 10 }]}>Font Style</Text>
                            <TouchableOpacity onPress={() => setFontStyle(fontStyle === "serif" ? "sans" : "serif")}>
                                <Text style={{ color: theme.auth.text }}>{fontStyle}</Text>
                            </TouchableOpacity>
                            <Text style={{ color: theme.auth.text, fontSize: 14, marginLeft: 10 }}>
                                ← Tap to toggle style
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[Layout.button, { backgroundColor: theme.auth.navbar, marginBottom: 10, borderWidth: 1, borderColor: theme.auth.text }]}
                            onPress={async () => {
                            await SecureStore.deleteItemAsync("themeMode");
                            await SecureStore.deleteItemAsync("fontSize");
                            await SecureStore.deleteItemAsync("fontStyle");

                            setThemeMode("system");
                            setFontSize("medium");
                            setFontStyle("serif");

                            Toast.show("Appearance reset to default", {
                                duration: Toast.durations.SHORT,
                                position: Toast.positions.BOTTOM,
                            });
                            }}
                        >
                            <Text style={[Typography.label, { color: theme.auth.text }]}>Reset to Default</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 20, borderTopWidth: 1, borderColor: theme.auth.text, paddingTop: 10 }}>
                        <Text style={[Typography.label, { fontWeight: 'bold', marginBottom: 10, color: theme.auth.text }]}> 
                            Export Data
                        </Text>
                        <TouchableOpacity
                            style={[Layout.button, {backgroundColor: theme.auth.navbar, marginBottom: 10, borderWidth: 1, borderColor: theme.auth.text }]}
                            onPress={() => handleExportData("json")}
                        >
                            <Text style={[Typography.label, {color: theme.auth.text}]}>Export JSON</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[Layout.button, { backgroundColor: theme.auth.navbar, borderWidth: 1, borderColor: theme.auth.text }]}
                            onPress={() => handleExportData("zip")}
                        >
                            <Text style={[Typography.label, {color: theme.auth.text}]}>Export ZIP</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderColor: theme.auth.text }}>
                        <Text style={[Typography.label, { fontWeight: 'bold', marginBottom: 10, color: theme.auth.text }]}>
                            Advanced / Troubleshooting
                        </Text>

                        <TouchableOpacity
                            style={[Layout.button, { backgroundColor: theme.auth.navbar, marginBottom: 10, borderWidth: 1, borderColor: theme.auth.text  }]}
                            onPress={async () => {
                            Alert.alert(
                                "Clear Cache",
                                "Are you sure you want to clear all cached data? This will reset streaks and local journal entries, but won’t delete your account.",
                                [
                                { text: "Cancel", style: "cancel" },
                                { text: "Clear Cache", style: "destructive", onPress: async () => {
                                    await clearAllCache();
                                    Toast.show("Cache cleared successfully!", {
                                    duration: Toast.durations.SHORT,
                                    position: Toast.positions.BOTTOM,
                                    });
                                } }
                                ]
                            );
                            }}
                        >
                            <Text style={[Typography.label, {color: theme.auth.text}]}>Clear Cache</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 10, borderTopWidth: 1, borderColor: 'red', paddingTop: 10 }}>
                        <Text style={[Typography.label, { color: 'red', fontWeight: 'bold',}]}>Danger Zone</Text>
                        <TouchableOpacity
                            style={[Layout.button, { backgroundColor: '#ff4d4f', borderColor: theme.auth.text, borderWidth: 1, marginTop: 10 }]}
                            onPress={() => setIsDeleteConfirmVisible(true)}
                        >
                            <Text style={[Typography.label, {color: theme.auth.text}]}>Delete My Account</Text>
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