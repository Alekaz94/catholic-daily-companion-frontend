import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feedback } from "../models/Feedback";
import { useAppTheme } from "../hooks/useAppTheme";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import Divider from "./Divider";
import { formatSubmittedAt } from "../utils/dateUtils";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";

interface Props {
    visible: boolean;
    feedback: Feedback | null;
    onClose: () => void;  
    handleUpdate: () => void;
}

const AdminFeedbackModal: React.FC<Props> = ({ visible, feedback, onClose, handleUpdate }) => {
    const theme = useAppTheme();
    const {isDark} = useTheme();
    const [updating, setUpdating] = useState(false);

    if(!feedback) {
        return null;
    }

    const onUpdatePress = async () => {
        if(updating) {
            return;
        }

        setUpdating(true);

        try {
            await handleUpdate();
        } catch (error) {
            console.error("Update failed", error);
        } finally {
            setUpdating(false);
        }
    }
    
    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                <View style={[Layout.container, {backgroundColor: theme.auth.background, margin: 20, borderRadius: 10}]}>
                    <Text style={[Typography.italic, {color: theme.journal.text, fontSize: 22, textAlign: "center"}]}>Feedback</Text>

                    <Divider />

                    {updating ? (
                        <ActivityIndicator size="small" color="gray" />
                    ) : (
                        <TouchableOpacity style={{alignItems: "center"}} onPress={onUpdatePress} disabled={updating}>
                            <Ionicons
                                name={isDark ? "checkmark-done-circle-outline" : "checkmark-done-circle"}
                                size={30}
                                color={feedback.isFixed === true ? "green" : "gray"}
                            />
                        </TouchableOpacity>
                    )}

                    <Divider />

                    <View style={[Layout.container, {justifyContent: "space-between"}]}>
                        <View>
                            <Text style={[Typography.title, {color: theme.auth.text}]}>{feedback?.category}</Text>
                            <Text style={[Typography.body, {color: theme.auth.text, fontSize: 16, marginVertical: 5}]}>{formatSubmittedAt(feedback?.submittedAt)}</Text>
                            <Text style={[Typography.label, {color: theme.auth.text}]}>{feedback?.message}</Text>
                        </View>
                        <View>
                            <Text style={[Typography.body, {color: theme.auth.text, fontSize: 16, marginVertical: 5}]}>From: {feedback?.email}</Text>
                        </View>
                    </View>

                    <Divider />

                    <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: theme.auth.navbar}]}>
                        <Text style={[Layout.buttonText, {textAlign: "center", color: theme.auth.text}]}>Close</Text>
                    </TouchableOpacity> 
                </View>
            </View>
        </Modal>
    )
}

export default AdminFeedbackModal;