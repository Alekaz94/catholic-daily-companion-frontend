import { useEffect, useState } from "react"
import { AdminUserOverviewDto } from "../models/AdminOverView"
import { useAppTheme } from "../hooks/useAppTheme";
import { getUserOverviewPaged } from "../services/AdminService";
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
import { Ionicons } from "@expo/vector-icons";

type AdminUserOverviewNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminUserOverview"
>

type UserOverviewRoute = RouteProp<AuthStackParamList, "AdminUserOverview">;

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

    const fetchFeedbackPage = async (page: number) => {
        if (!overview) {
            return;
        }

        try {
            const data = await getUserOverviewPaged(userId, page, 10);
        
            setOverview(prev => {
                if (!prev) {
                    return prev;
                }
                return {
                    ...prev,
                    feedbacks: data.feedbacks,
                };
            });
        } catch (error) {
            console.error("Failed to fetch feedback page", error);
        }
    };

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
                const data = await getUserOverviewPaged(userId, 0, 10);
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
                <View style={{ position: "absolute", top: 20, left: 2, marginLeft: 10}}>
                    <TouchableOpacity onPress={() => navigation.navigate("AdminAllUsersScreen")}>
                        <Ionicons name="arrow-back" size={28} color={theme.auth.text} />
                    </TouchableOpacity>
                </View>
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
                    <Text style={[Typography.body, { color: theme.auth.text }]}>Feedback submitted: {overview.feedbackCount}</Text>
                </View>

                {overview.feedbacks.content.length > 0 ? (
                    <CollapsibleSection title="Feedback Submitted" color={theme.auth.text} >
                        {overview.feedbacks.content.map((feedback, index) => (
                            <Text style={[Typography.body, { color: theme.auth.text, marginTop: 10 }]} key={index}>
                                {formatDateTime(feedback.submittedAt ?? "")}: {feedback.category}, {feedback.message}
                            </Text>
                        ))}

                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                            <TouchableOpacity
                                disabled={overview.feedbacks.pageNumber === 0}
                                onPress={() => fetchFeedbackPage(overview.feedbacks.pageNumber - 1)}
                            >
                                <Text style={{ color: theme.auth.text }}>Previous</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={overview.feedbacks.last}
                                onPress={() => fetchFeedbackPage(overview.feedbacks.pageNumber + 1)}
                            >
                                <Text style={{ color: theme.auth.text }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </CollapsibleSection>
                ) : (
                    <>
                        <Divider />
                        <Text style={[Typography.body, { color: theme.auth.text }]}>No feedback submitted</Text>
                    </>
                )}

                <View style={{ marginTop: 10, borderTopWidth: 1, borderColor: 'red', paddingTop: 10 }}>
                    <Text style={[Typography.label, { color: 'red', fontWeight: 'bold',}]}>Danger Zone</Text>
                    <TouchableOpacity
                        disabled={isLoading}
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