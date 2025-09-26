import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AuthStackParamList } from "../navigation/types"
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getStreak, isCompletedToday } from "../services/RosaryService";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { AppTheme } from "../styles/colors";
import { getMysteryTypeForToday, getWeekdayName } from "../data/RosarySequence";

const RosaryStatusBanner = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const { user } = useAuth();
    const [completed, setCompleted] = useState<boolean | null>(null);
    const [streak, setStreak] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const weekday = getWeekdayName(new Date());
    const mysteryType = getMysteryTypeForToday();

    useEffect(() => {
        const fetchData = async () => {
            if(!user?.id) {
                return;
            }

            try {
                const [done, streakCount] = await Promise.all([
                    isCompletedToday(user.id),
                    getStreak(user.id),
                ]);
                setCompleted(done);
                setStreak(streakCount);
            } catch (error) {
                console.error("Failed to load rosary data:", error)
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [user]);

    const handlePress = () => {
        navigation.navigate("Rosary")
    };

    if(isLoading || completed === null) {
        return (
            <View style={{
                backgroundColor: AppTheme.prayer.background,
                borderRadius: 12,
                padding: 16,
                marginVertical: 12,
                alignItems: "center"
            }}>
                <ActivityIndicator size="small" color="#1E3A8A" /> 
            </View>
        )
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
            <View style={{
                backgroundColor: completed ? "#D1FAE5" : "#FFF1F2",
                borderRadius: 12,
                padding: 16,
                marginVertical: 12,
                borderLeftWidth: 5,
                borderLeftColor: completed ? "#10B981" : "#F43F5E"
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: "600", color: completed ? "#065F46" : "#9F1239" }}>
                    📿 Pray the Rosary
                </Text>
                <Text style={{ fontSize: 14, marginTop: 6 }}>
                    Today is <Text style={{ fontWeight: "bold" }}>{weekday}</Text>, we pray the <Text style={{ fontStyle: "italic" }}>{mysteryType}</Text>.
                </Text>
                <Text style={{ fontSize: 14, marginTop: 6 }}>
                    {completed
                        ?   `You have prayed the rosary today.  🙏 Streak: ${streak} ${streak === 1 ? "day" : "days"}`
                        :   "You haven't prayed the rosary today. Want to pray now?"
                    }
                </Text>
                <Text style={{ fontSize: 13, marginTop: 8, color: AppTheme.prayer.text, textAlign: "right" }}>
                    {completed ? "Tap to reflect more" : "Tap to begin praying →"}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default RosaryStatusBanner;