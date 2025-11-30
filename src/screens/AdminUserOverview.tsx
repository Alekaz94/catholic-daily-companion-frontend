import { useEffect, useState } from "react"
import { AdminUserOverviewDto } from "../models/AdminOverView"
import { useAppTheme } from "../hooks/useAppTheme";
import { getUserOverview } from "../services/AdminService";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/Navbar";
import { useTypography } from "../styles/Typography";
import Divider from "../components/Divider";
import { Layout } from "../styles/Layout";
import DeleteAccountConfirmModal from "../components/DeleteAccountConfirmModal";
import Toast from "react-native-root-toast";
import { deleteUser } from "../services/UserService";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import CollapsibleSection from "../components/CollapsibleSection";

type AdminUserOverviewNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminUserOverview"
>

type UserOverviewRoute = RouteProp<AuthStackParamList, "AdminUserOverview">;

const AdminUserOverview = () => {
    const { params } = useRoute<UserOverviewRoute>();
    const { userId } = params;

    const user = useRequireAuth();
    const [overview, setOverview] = useState<AdminUserOverviewDto | null>(null);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useAppTheme();
    const Typography = useTypography();
    const navigation = useNavigation<AdminUserOverviewNavigationProp>();

    if(!user) {
        return null;
    }

    const handleDeleteAccount = async () => {
        try {
            setIsLoading(true)
            await deleteUser(userId);

            Toast.show("Account deleted successfully.", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
            });

            navigation.goBack();
        } catch (error) {
            console.error("Delete account failed", error);
            Toast.show("Failed to delete account. Try again.", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
            });
        } finally {
            setIsLoading(false)
            setIsDeleteVisible(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserOverview(userId);
                setOverview(data);
            } catch(error) {
                console.error(error);
            }
        }
        
        fetchData();
    }, [user, userId]);

    if (!overview) {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.navbar}}>
                <Navbar />
                <View style={[Layout.container]}>
                    <ActivityIndicator size="large" color="#1E3A8A" />
                    <Text style={[Typography.label, { marginTop: 10, color: theme.auth.text, textAlign: "center" }]}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.navbar}}>
            <Navbar />
            <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1, backgroundColor: theme.auth.background}}>
                <Text style={[Typography.title, {textAlign: "center", fontWeight: "600", color: theme.auth.text}]}>User Overview</Text>

                <Divider />

                <View>
                    <Text style={[Typography.body, { color: theme.auth.text }]}>
                        {overview.user.firstName} {overview.user.lastName} ({overview.user.role})
                    </Text>
                    <Text style={[Typography.body, { color: theme.auth.text }]}>User id: {overview.user.id}</Text>
                    <Text style={[Typography.body, { color: theme.auth.text }]}>Email: {overview.user.email}</Text>
                    <Text style={[Typography.body, { color: theme.auth.text }]}>Created At: {overview.user.createdAt}</Text>
                    <Text style={[Typography.body, { color: theme.auth.text }]}>Updated At: {overview.user.updatedAt}</Text>
                </View>

                <View style={{ marginTop: 20, borderTopWidth: 1, borderColor: theme.auth.text, paddingTop: 10 }}>
                    <Text style={[Typography.label, { fontWeight: 'bold', marginBottom: 10, color: theme.auth.text }]}> 
                        Stats
                    </Text>
                    <Text style={[Typography.body, { color: theme.auth.text }]}>Journal Entries: {overview.journalCount}</Text>
                    <Text style={[Typography.body, { color: theme.auth.text }]}>Rosaries Prayed: {overview.rosaryCount}</Text>
                </View>

                <CollapsibleSection title="Rosary Dates" color={theme.auth.text} >
                    {overview.rosaryDates.map((date, index) => (
                        <Text style={[Typography.body, { color: theme.auth.text }]} key={index}>{date}</Text>
                    ))}
                </CollapsibleSection>

                <CollapsibleSection title="Audit Logs" color={theme.auth.text} >
                    {overview.auditLogs.map((log, index) => (
                        <Text style={[Typography.body, { color: theme.auth.text, marginBottom: 10 }]} key={index}>
                            {log.createdAt}: {log.action} on {log.entityType} ({log.metadata})
                        </Text>
                    ))}
                </CollapsibleSection>

                <View style={{ marginTop: 10, borderTopWidth: 1, borderColor: 'red', paddingTop: 10 }}>
                    <Text style={[Typography.label, { color: 'red', fontWeight: 'bold',}]}>Danger Zone</Text>
                    <TouchableOpacity
                        style={[Layout.button, { backgroundColor: '#ff4d4f', borderColor: theme.auth.text, borderWidth: 1, marginTop: 10 }]}
                        onPress={() => setIsDeleteVisible(true)}
                    >
                        <Text style={[Typography.label, {color: theme.auth.text}]}>Delete User Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <DeleteAccountConfirmModal
                visible={isDeleteVisible}
                onClose={() => setIsDeleteVisible(false)}
                onConfirm={handleDeleteAccount}
                isLoading={isLoading}
            />
        </SafeAreaView>
    )
}

export default AdminUserOverview;