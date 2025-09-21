import { Text, TouchableOpacity, View } from "react-native";
import { getDailyPrompt } from "../utils/getDailyPrompt"
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppTheme } from "../styles/colors";


const JournalPromptBanner = () => {
    const prompt = getDailyPrompt();
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    const handleNavigate = () => {
        navigation.navigate("Journal");
    }

    return (
        <TouchableOpacity onPress={handleNavigate} activeOpacity={0.8}>
            <View style={{
                backgroundColor: "#E9D8FD",
                borderRadius: 12,
                padding: 16,
                marginVertical: 12,
                borderLeftWidth: 5,
                borderLeftColor: AppTheme.journal.navbar
            }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#4B0082" }}>
                    ✍️ Daily Journal
                </Text>
                <Text style={{ fontSize: 14, marginTop: 6 }}>{prompt}</Text>

                <Text style={{
                    fontSize: 13,
                    marginTop: 8,
                    color: "#6B46C1",
                    textAlign: "right"
                }}>
                    Have something on your mind? Tap here to reflect →
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default JournalPromptBanner;