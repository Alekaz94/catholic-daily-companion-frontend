import { Text, TouchableOpacity, View } from "react-native";
import { AppTheme } from "../styles/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";

const PrayerBanner = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    const handlePress = () => {
        navigation.navigate("PrayerList");
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
            <View style={{
                backgroundColor: AppTheme.prayer.background,
                borderRadius: 12,
                padding: 16,
                marginVertical: 12,
                borderLeftWidth: 5,
                borderLeftColor: AppTheme.prayer.navbar
            }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: AppTheme.prayer.text }}>
                    🙏 Prayer is Good for the Soul
                </Text>
                <Text style={{ fontSize: 14, marginTop: 6, fontStyle: "italic" }}>
                    Have you prayed today? Or just need some inspiration or somewhere to start?
                </Text>
                <Text style={{ fontSize: 13, marginTop: 8, color: AppTheme.prayer.text, textAlign: "right" }}>
                    Tap to begin praying →
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default PrayerBanner;