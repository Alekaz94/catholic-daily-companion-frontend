import { View, Text } from "react-native";
import { useNetwork } from "../context/NetworkContext"
import { Layout } from "../styles/Layout";
import { useAppTheme } from "../hooks/useAppTheme";

const OfflineBanner = () => {
    const { isConnected, isInternetReachable } = useNetwork();
    const theme = useAppTheme();

    if(isConnected && isInternetReachable !== false) {
        return null;
    }

    return (
        <View style={Layout.banner}>
            <Text style={{color: theme.auth.text, fontWeight: "500", fontSize: 14}}>You're offline - some features may not work.</Text>
        </View>
    )
}

export default OfflineBanner;