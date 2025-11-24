import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useAppTheme } from "../hooks/useAppTheme";

const PrayerBanner = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const theme = useAppTheme();

    const handlePress = () => {
        navigation.navigate("PrayerList");
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
            <View style={{
                backgroundColor: theme.prayer.banner,
                borderRadius: 12,
                padding: 16,
                marginVertical: 12,
                borderLeftWidth: 5,
                borderLeftColor: theme.prayer.navbar
            }}>
                <Text style={{ fontWeight: "600", color: theme.prayer.text }}>
                    🙏 Prayer is Good for the Soul
                </Text>
                <Text style={{ marginTop: 6, fontStyle: "italic", color: theme.prayer.text }}>
                    Have you prayed today? Or just need some inspiration or somewhere to start?
                </Text>
                <Text style={{marginTop: 8, color: theme.prayer.text, textAlign: "right" }}>
                    Tap to begin praying →
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default PrayerBanner;