import { Text, TouchableOpacity, View } from "react-native";
import { getDailyPrompt } from "../utils/getDailyPrompt"
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppTheme } from "../hooks/useAppTheme";

const JournalPromptBanner = () => {
    const theme = useAppTheme();
    const prompt = getDailyPrompt();
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    const handleNavigate = () => {
        navigation.navigate("Journal");
    }

    return (
        <TouchableOpacity onPress={handleNavigate} activeOpacity={0.8}>
            <View style={{
                backgroundColor: theme.journal.cardTwo,
                borderRadius: 12,
                padding: 16,
                marginVertical: 12,
                borderLeftWidth: 5,
                borderLeftColor: theme.journal.navbar
            }}>
                <Text style={{fontWeight: "600", color: theme.journal.text }}>
                    ✍️ Daily Journal
                </Text>
                <Text style={{ marginTop: 6, color: theme.journal.text }}>{prompt}</Text>

                <Text style={{
                    marginTop: 8,
                    color: theme.journal.text,
                    textAlign: "right"
                }}>
                    Have something on your mind? Tap here to reflect →
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default JournalPromptBanner;