import { Text, View } from "react-native"
import { Typography } from "../styles/Typography"
import { useAppTheme } from "../hooks/useAppTheme"

const FeatureItem = ({ icon, text }: {icon: string, text: string}) => {
    const theme = useAppTheme();

    return (
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
        <Text style={[Typography.italic, { marginLeft: 10, fontSize: 16, color: theme.auth.text }]}>{text}</Text>
    </View>
    )
}

export default FeatureItem;