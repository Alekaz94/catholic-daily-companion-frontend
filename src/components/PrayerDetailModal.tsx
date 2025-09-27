import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import Divider from "./Divider";
import { useAppTheme } from "../hooks/useAppTheme";

interface Props {
    visible: boolean;
    title: string;
    text: string;
    onClose: () => void;
}

const PrayerDetailModal = ({ visible, title, text, onClose }: Props) => {
    const theme = useAppTheme();

    if(!title && !text) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={[Layout.container, {backgroundColor: theme.prayer.background}]}>
                <Text style={[Typography.italic, {textAlign: "center", fontSize: 22, fontWeight: "600", color: theme.prayer.text}]}>{title}</Text>
                <Divider />
                <Text style={[Typography.body, {marginTop: 20, marginBottom: 20, color: theme.journal.text, fontSize: 18}]}>{text}</Text>
                <Divider />
                <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: theme.prayer.button, borderWidth: 1}]}>
                    <Text style={[Layout.buttonText, {alignSelf: "center", color: theme.prayer.text}]}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default PrayerDetailModal;