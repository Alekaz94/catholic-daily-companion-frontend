import { Text, View } from "react-native";
import { getDailyPrompt } from "../utils/getDailyPrompt"


const JournalPromptBanner = () => {
    const prompt = getDailyPrompt();

    return (
        <View style={{
            backgroundColor: "#E9D8FD",
            borderRadius: 12,
            padding: 16,
            marginVertical: 12
        }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#4B0082" }}>
                ✍️ Daily Prompt
            </Text>
            <Text style={{ fontSize: 14, marginTop: 6 }}>{prompt}</Text>
        </View>
    )
}

export default JournalPromptBanner;