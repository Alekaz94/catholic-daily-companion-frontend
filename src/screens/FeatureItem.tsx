import { Text, View } from "react-native"
import { Typography } from "../styles/Typography"

const FeatureItem = ({ icon, text }: {icon: string, text: string}) => {
    return (
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
        <Text style={[Typography.italic, { marginLeft: 10, fontSize: 16 }]}>{text}</Text>
    </View>
    )
}

export default FeatureItem;