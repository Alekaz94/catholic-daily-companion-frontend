import { Text, View } from "react-native";
import { getQuoteOfTheDay } from "../utils/getQuoteOfTheDay"
import { useAppTheme } from "../hooks/useAppTheme";

const QuoteBanner = () => {
    const quote = getQuoteOfTheDay();
    const theme = useAppTheme();

    return (
        <View style={{
            backgroundColor: theme.saint.background,
            borderRadius: 12,
            padding: 16,
            marginVertical: 12,
            borderLeftWidth: 5,
            borderLeftColor: theme.saint.navbar
        }}>
            <Text style={{ fontWeight: "600", color: theme.saint.text }}>
                📖 {quote.type === "verse" ? "Verse of the Day" : "Quote of the Day"}
            </Text>
            <Text style={{  marginTop: 6, fontStyle: "italic", color: theme.saint.text }}>
                "{quote.content}"
            </Text>
            <Text style={{  textAlign: "right", marginTop: 4, color: theme.saint.text }}>
                {quote.reference || quote.author}
            </Text>
        </View>
    )
}

export default QuoteBanner;