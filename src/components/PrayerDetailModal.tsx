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
            <View style={[Layout.container, {backgroundColor: AppTheme.journal.background}]}>
                <Text style={[Typography.title, {color: AppTheme.journal.text, alignSelf: "center"}]}>{title}</Text>
                <Text style={[Typography.body, {marginTop: 20, marginBottom: 20, color: AppTheme.journal.text}]}>{text}</Text>
                
                <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: "#B794F4", borderWidth: 1}]}>
                    <Text style={[Layout.buttonText, {alignSelf: "center", color: AppTheme.journal.text}]}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default PrayerDetailModal;