import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";
import { Layout } from "../styles/Layout";
import { useTypography } from "../styles/Typography";

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

const PasswordChangeConfirmModal: React.FC<Props> = ({ visible, onClose, onConfirm, isLoading }) => {
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
                    <Text style={Typography.title}>Are you sure you want to update your password?</Text>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            style={[Layout.button, {backgroundColor: theme.auth.text, width: "30%", marginRight: 40}]}
                            onPress={onConfirm}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={Layout.buttonText}>Update</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Layout.button, {backgroundColor: theme.auth.text, width: "30%"}]}
                            onPress={onClose}
                        >
                            <Text style={[Layout.buttonText, {color: "black"}]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default PasswordChangeConfirmModal;