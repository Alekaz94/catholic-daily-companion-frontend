import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";
import { Layout } from "../styles/Layout";
import { useTypography } from "../styles/Typography";
import { Colors } from "../styles/colors";

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

const NameChangeConfirmModal: React.FC<Props> = ({ visible, onClose, onConfirm, isLoading }) => {
    const theme = useAppTheme();
    const Typography = useTypography();

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={[Layout.container, {justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)'}]}>
                <View style={{backgroundColor: theme.auth.background, padding: 20, borderRadius: 10, borderWidth: 1, borderColor: theme.auth.text }}>
                    <Text style={[Typography.title, {textAlign: "center", color: theme.auth.text}]}>Are you sure you want to update your name?</Text>
                    <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                        <TouchableOpacity
                            style={[Layout.button, {backgroundColor: Colors.surface, width: "30%"}]}
                            onPress={onClose}
                        >
                            <Text style={[Layout.buttonText, {color: theme.auth.text}]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Layout.button, {backgroundColor: theme.auth.navbar, width: "30%"}]}
                            onPress={onConfirm}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={[Layout.buttonText, {color: theme.auth.text}]}>Update</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default NameChangeConfirmModal;