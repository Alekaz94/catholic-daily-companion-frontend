import { ActivityIndicator, Text, View } from "react-native"
import { Typography } from "../styles/Typography"

const LoadingScreen = () => {
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff"}}>
            <ActivityIndicator size={"large"} color="#6B46C1" />
            <Text style={[Typography.body, {marginTop: 20, fontSize: 18, color:"#6B46C1"}]}>Loading...</Text>
        </View>
    )
}

export default LoadingScreen;
