import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Rosary } from "../models/Rosary";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import { useAppTheme } from "../hooks/useAppTheme";

type Props = {
    visible: boolean;
    onClose: () => void;
    history: Rosary[];
}

const RosaryHistoryModal: React.FC<Props> = ({visible, onClose, history}) => {
    const theme = useAppTheme();

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
                    borderColor: theme.prayer.text
                }}>
                    <Text style={[Typography.title, { marginTop: 16, alignSelf: "center", color: theme.prayer.text }]}>Rosary History</Text>
                    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                        {history.length === 0 ? (
                            <Text style={[Typography.body, {textAlign: "center", color: theme.prayer.text}]}>No rosary history available.</Text>
                        ) : (
                            history.map((entry) => (
                                <Text key={entry.id} style={[Typography.body, {fontSize: 16, marginBottom: 4, color: theme.prayer.text}]}>
                                    {entry.date} - {entry.completed ? "✅" : "❌"}
                                </Text>
                            ))
                        )}
                    </ScrollView>

                    <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: theme.prayer.cardOne, borderWidth: 1}]}>
                        <Text style={[Layout.buttonText, {alignSelf: "center", color: theme.prayer.text}]}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default RosaryHistoryModal;