import { SafeAreaView } from "react-native-safe-area-context"
import { Layout } from "../styles/Layout";
import Navbar from "../components/Navbar";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";
import Divider from "../components/Divider";
import { useTypography } from "../styles/Typography";
import { useEffect, useState } from "react";
import { Feedback, PageResponse } from "../models/Feedback";
import { getAllFeedback, updateFeedback } from "../services/FeedbackService";
import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import AdminFeedbackModal from "../components/AdminFeedbackModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { formatSubmittedAt } from "../utils/dateUtils";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { Ionicons } from "@expo/vector-icons";

type AdminFeedbackNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminFeedbackScreen"
>

type FeedbackPage = PageResponse<Feedback>;

const AdminFeedbackScreen = () => {
    const theme = useAppTheme();
    const user = useRequireAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackPage, setFeedbackPage] = useState<FeedbackPage>({
        content: [],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 1,
        last: true
    });
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [showFixed, setShowFixed] = useState(false);
    const navigation = useNavigation<AdminFeedbackNavigationProp>();
    const Typography = useTypography();

    if(!user) {
        return null;
    }

    const loadFeedback = async (pageNumber: number) => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const result = await getAllFeedback(pageNumber);

            setFeedbackPage(prev => ({
                ...result,
                content: pageNumber === 0 ? result.content : [...prev.content, ...result.content]
            }));
        } catch (error) {
            console.error("Failed to load feedback", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        if (!feedbackPage.last) {
            loadFeedback(feedbackPage.pageNumber + 1);
        }
    };
    
    const handleUpdate = async () => {
        if (!selectedFeedback) {
            return;
        }
    
        const newStatus = !selectedFeedback.isFixed;
    
        try {
            setIsLoading(true);
    
            const updatedFeedback = await updateFeedback(selectedFeedback.id, {
                isFixed: newStatus
            });
    
            setFeedbackPage(prev => ({
                ...prev,
                content: prev.content.map(fb =>
                    fb.id === updatedFeedback.id ? updatedFeedback : fb
                )
            }));
    
            setSelectedFeedback(updatedFeedback);
            setModalVisible(false);
        } catch (error) {
            console.error("Failed to update feedback", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFeedback(0);
    }, [user]);

    const filteredFeedback = feedbackPage.content.filter(fb => fb.isFixed === showFixed);
    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.background}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: theme.auth.background}]}>
            <View style={{ position: "absolute", top: 20, left: 2, marginLeft: 15}}>
                <TouchableOpacity onPress={() => navigation.navigate("AdminPanel")}>
                    <Ionicons name="arrow-back" size={28} color={theme.auth.text} />
                </TouchableOpacity>
            </View>
                <Text style={[Typography.title, {fontSize: 22, marginBottom: 10, textAlign: "center", color: theme.auth.text}]}>All Feedback</Text>
                <Divider />

                <View style={{ alignItems: "center", marginBottom: 10 }}>
                    <TouchableOpacity
                        onPress={() => setShowFixed(prev => !prev)}
                        style={{
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 6,
                        backgroundColor: theme.auth.navbar,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        }}
                    >
                        <Text style={{ color: theme.auth.text }}>
                            {showFixed ? "Show Unfixed Feedback" : "Show Fixed Feedback"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isLoading ? 
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="gray" />
                    </View> 
                : (
                    <FlatList
                        data={filteredFeedback}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedFeedback(item)
                                    setModalVisible(true)
                                }}
                                disabled={isLoading}
                            >
                                <LinearGradient
                                    colors={[theme.auth.navbar, theme.auth.navbar]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={[Layout.card, {
                                        borderWidth: 1,
                                        borderColor: "#ccc",
                                        shadowRadius: 6,
                                        elevation: 3, 
                                        borderRadius: 12,
                                        marginTop: 10
                                    }]}
                                >
                                        <View style={{flexDirection: "column", justifyContent: "space-between"}}>
                                            <Text style={[Typography.body, {color: theme.auth.text}]}>{formatSubmittedAt(item.submittedAt)}</Text>
                                            <Text style={[Typography.label, {color: theme.auth.text}]}>{item.category}</Text>
                                        </View>
                                </LinearGradient>
                            </TouchableOpacity>

                        )}
                        onEndReachedThreshold={0.2}
                        onEndReached={loadMore}
                        ListFooterComponent={isLoading ? (
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                                <ActivityIndicator size="small" color={theme.auth.text} />
                                <Text style={{ marginLeft: 10, color: theme.auth.text }}>Loading more...</Text>
                            </View> 
                        ) : null}
                    />
                )}
            </View>

            <AdminFeedbackModal 
                visible={modalVisible}
                feedback={selectedFeedback}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedFeedback(null);
                }}
                handleUpdate={handleUpdate}      
            />
        </SafeAreaView>
    )
}

export default AdminFeedbackScreen;