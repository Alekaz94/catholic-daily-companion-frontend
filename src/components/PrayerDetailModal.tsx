import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import { AppTheme } from "../styles/colors";

interface Props {
    visible: boolean;
    title: string;
    text: string;
    onClose: () => void;
}

const PrayerDetailModal = ({ visible, title, text, onClose }: Props) => {
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
            <View style={[Layout.container, {backgroundColor: AppTheme.prayer.background}]}>
                <Text style={[Typography.italic, { marginBottom: 6, alignSelf: "center", fontSize: 20 }]}>{title}</Text>
                <Text style={[Typography.body, {marginTop: 20, marginBottom: 20, color: AppTheme.journal.text, fontSize: 16}]}>{text}</Text>
                
                <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: "#ADD8E6", borderWidth: 1}]}>
                    <Text style={[Layout.buttonText, {alignSelf: "center", color: AppTheme.prayer.text}]}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default PrayerDetailModal;