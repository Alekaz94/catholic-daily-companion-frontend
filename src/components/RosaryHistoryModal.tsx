import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Rosary } from "../models/Rosary";
import { Layout } from "../styles/Layout";
import { useTypography } from "../styles/Typography";
import { useAppTheme } from "../hooks/useAppTheme";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useState } from "react";

type Props = {
    visible: boolean;
    onClose: () => void;
    history: Rosary[];
    pageSize?: number;
}

const RosaryHistoryModal: React.FC<Props> = ({visible, onClose, history, pageSize = 10}) => {
    const theme = useAppTheme();
    const user = useRequireAuth();
    const Typography = useTypography();
    const [page, setPage] = useState(1);

    if(!user) {
        return null;
    }

    const startIndex = 0;
    const endIndex = page * pageSize;
    const paginatedHistory = history.slice(startIndex, endIndex);
    const hasMore = endIndex < history.length;

    const loadMore = () => setPage(prev => prev + 1);
    
    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
            transparent={true}
        >
            <View style={[Layout.container, {backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center",}]}>
                <View style={{
                    backgroundColor: theme.prayer.background,
                    borderRadius: 12,
                    padding: 20,
                    width: "100%",
                    maxHeight: "80%",
                    borderColor: theme.prayer.text,
                    borderWidth: 1
                }}>
                    <Text style={[Typography.title, { marginTop: 16, alignSelf: "center", color: theme.prayer.text }]}>Rosary History</Text>
                    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                        {paginatedHistory.length === 0 ? (
                            <Text style={[Typography.body, {textAlign: "center", color: theme.prayer.text}]}>
                                No rosary history available.
                            </Text>
                        ) : (
                            paginatedHistory.map((entry) => (
                                <Text key={entry.id} style={[Typography.body, { marginBottom: 4, color: theme.prayer.text, textAlign: "center"}]}>
                                    {entry.date} - {entry.completed ? "✅" : "❌"}
                                </Text>
                            ))
                        )}
                        {hasMore && (
                            <TouchableOpacity onPress={loadMore} style={[Layout.button, {marginTop: 10}]}>
                                <Text style={[Typography.label, {alignSelf: "center", color: theme.prayer.text}]}>Load More</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>

                    <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: theme.prayer.cardOne}]}>
                        <Text style={[Typography.label, {alignSelf: "center", color: theme.prayer.text}]}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default RosaryHistoryModal;