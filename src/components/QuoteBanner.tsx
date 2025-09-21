import { Text, View } from "react-native";
import { getQuoteOfTheDay } from "../utils/getQuoteOfTheDay"
import { AppTheme } from "../styles/colors";

const QuoteBanner = () => {
    const quote = getQuoteOfTheDay();

    return (
        <View style={{
            backgroundColor: "#FFF8E1",
            borderRadius: 12,
            padding: 16,
            marginVertical: 12,
            borderLeftWidth: 5,
            borderLeftColor: AppTheme.saint.navbar
        }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#8B4513" }}>
                📖 {quote.type === "verse" ? "Verse of the Day" : "Quote of the Day"}
            </Text>
            <Text style={{ fontSize: 14, marginTop: 6, fontStyle: "italic" }}>
                "{quote.content}"
            </Text>
            <Text style={{ fontSize: 13, textAlign: "right", marginTop: 4 }}>
                {quote.reference || quote.author}
            </Text>
        </View>
    )
}

export default QuoteBanner;