import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";
import { Layout } from "../styles/Layout";
import { useAppTheme } from "../hooks/useAppTheme";
import { useTypography } from "../styles/Typography";
import { Colors } from "../styles/colors";

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

const DeleteAccountConfirmModal: React.FC<Props> = ({visible, onClose, onConfirm, isLoading}) => {
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
                <View style={{backgroundColor: theme.auth.background, padding: 20, borderRadius: 10, borderWidth: 1, borderColor: 'red' }}>
                    <Text style={[Typography.title, { color: 'red', textAlign: 'center', marginBottom: 10 }]}>
                        Are you sure you want to delete your account?
                    </Text>
                    <Text style={[Typography.body, { textAlign: 'center', marginBottom: 20 }]}>
                        This action is irreversible and will permanently delete your data.
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity
                            style={[Layout.button, { backgroundColor: "lightgray", width: 100 }]}
                            onPress={onClose}
                        >
                            <Text style={[Layout.buttonText, { color: 'black' }]}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[Layout.button, { backgroundColor: Colors.error, width: 100}]}
                            onPress={onConfirm}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={[Layout.buttonText, {color: theme.auth.text}]}>Delete</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default DeleteAccountConfirmModal;