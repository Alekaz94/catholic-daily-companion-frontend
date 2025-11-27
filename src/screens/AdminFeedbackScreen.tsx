import { SafeAreaView } from "react-native-safe-area-context"
import { Layout } from "../styles/Layout";
import Navbar from "../components/Navbar";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";
import Divider from "../components/Divider";
import { useTypography } from "../styles/Typography";
import { useEffect, useState } from "react";
import { Feedback } from "../models/Feedback";
import { getAllFeedback, updateFeedback } from "../services/FeedbackService";
import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import AdminFeedbackModal from "../components/AdminFeedbackModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { formatSubmittedAt } from "../utils/dateUtils";
import { useRequireAuth } from "../hooks/useRequireAuth";

type AdminFeedbackNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminFeedbackScreen"
>

const AdminFeedbackScreen = () => {
    const theme = useAppTheme();
    const user = useRequireAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation<AdminFeedbackNavigationProp>();
    const [showFixed, setShowFixed] = useState(false);
    const Typography = useTypography();

    if(!user) {
        return null;
    }
    
    const handleUpdate = async () => {
        if(!selectedFeedback) {
            return;
        }

        const newStatus = selectedFeedback.isFixed === true ? false : true;

        try {
            setIsLoading(true);

            const updatedFeedback = await updateFeedback(selectedFeedback.id, {
                isFixed: newStatus
            });

            setFeedback(prevFeedbacks => 
                prevFeedbacks.map(fb => 
                    fb.id === updatedFeedback.id ? updatedFeedback : fb
                )
            );
            
            setSelectedFeedback(updatedFeedback);

            setModalVisible(false);
        } catch (error) {
            console.error("Failed to update feedback", error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchFeedback = async () => {
            try{
                setIsLoading(true);
                const result = await getAllFeedback();
                setFeedback(result);
            } catch (error) {
                console.error("Failed to fetch all feedback", error)
            } finally {
                setIsLoading(false);
            }
        }

        fetchFeedback();
    }, [user])
    
    const filteredFeedback = feedback.filter(fb => fb.isFixed === showFixed);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.background}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: theme.auth.background}]}>
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
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedFeedback(item)
                                        setModalVisible(true)
                                    }}
                                    disabled={isLoading}
                                >
                                    <View style={{flexDirection: "column", justifyContent: "space-between"}}>
                                        <Text style={[Typography.body, {color: theme.auth.text}]}>{formatSubmittedAt(item.submittedAt)}</Text>
                                        <Text style={[Typography.label, {color: theme.auth.text}]}>{item.category}</Text>
                                    </View>
                                </TouchableOpacity>
                            </LinearGradient>
                        )}
                        onEndReachedThreshold={0.2}
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