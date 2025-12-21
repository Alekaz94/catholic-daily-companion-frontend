import { Linking, Modal, Text, TouchableOpacity, View, Image } from "react-native";
import { Layout } from "../styles/Layout";
import { useAppTheme } from "../hooks/useAppTheme";
import { useTypography } from "../styles/Typography";
import cdc_transparent_black from "../assets/images/cdc_transparent_black.png"

type Props = {
  visible: boolean;
  latestVersion: string;
  storeUrl: string;
  onDismiss: () => void;
};

const SoftUpdateModal = ({ visible, latestVersion, storeUrl, onDismiss }: Props) => {
const theme = useAppTheme();
  const Typography = useTypography();

  const handleUpdateNow = () => {
    Linking.openURL(storeUrl).catch(err => console.error("Failed to open store URL", err));
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center'}}>
        <View style={{justifyContent: "center", backgroundColor: theme.auth.background, marginHorizontal: 20, borderRadius: 16, padding: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }}>
            <Image source={cdc_transparent_black} style={{width: 250, height: 250, marginBottom: -70, marginTop: -50, resizeMode: "contain", justifyContent: "center", alignSelf: "center"}} />
            <Text style={[Typography.title, { color: theme.auth.text, textAlign: "center", marginBottom: 15 }]}>Update Available</Text>

            <Text style={[Typography.body, { color: theme.auth.text, marginBottom: 15 }]}>
                A newer version of Catholic Daily Companion is available. Update to get the latest features.
            </Text>

            <View style={{ marginTop: 20, gap: 8, marginBottom: 20, flexDirection: "row", justifyContent: "space-evenly"}}>
                <TouchableOpacity
                    style={[Layout.button, { backgroundColor: "darkgray", width: "40%", flexDirection: "row", justifyContent: "center", alignItems: "center"  }]}
                    onPress={onDismiss}
                >
                    <Text style={[Typography.label, { color: theme.auth.text }]}>
                    Dismiss
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[Layout.button, { backgroundColor: theme.auth.navbar, width: "40%", flexDirection: "row", justifyContent: "center", alignItems: "center" }]}
                    onPress={handleUpdateNow}
                >
                    <Text style={[Typography.label, { color: theme.auth.text }]}>
                    Update Now
                    </Text>
                </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
};

export default SoftUpdateModal;
