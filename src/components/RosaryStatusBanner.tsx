import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AuthStackParamList } from "../navigation/types"
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { getStreak, isCompletedToday } from "../services/RosaryService";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { getMysteryTypeForToday, getWeekdayName } from "../data/RosarySequence";
import { useAppTheme } from "../hooks/useAppTheme";

const RosaryStatusBanner = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const { user } = useAuth();
    const [completed, setCompleted] = useState<boolean | null>(null);
    const [streak, setStreak] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const theme = useAppTheme();
    const weekday = useMemo(() => getWeekdayName(new Date()), []);
    const mysteryType = useMemo(() => getMysteryTypeForToday(), []);

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
                backgroundColor: theme.prayer.background,
                borderRadius: 12,
                padding: 16,
                marginVertical: 12,
                alignItems: "center"
            }}>
                <ActivityIndicator size="small" color={theme.prayer.text} /> 
            </View>
        )
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
            <View style={{
                backgroundColor: completed ? "#10B981" : "#FF6B6B",
                borderRadius: 12,
                padding: 16,
                marginVertical: 12,
                borderLeftWidth: 5,
                borderLeftColor: completed ? "#A7F3D0" : "#FFB3B8"
                }}
            >
                <Text style={{ fontWeight: "600", color: completed ? theme.prayer.text : theme.prayer.text }}>
                    📿 Pray the Rosary
                </Text>
                <Text style={{ marginTop: 6, color: theme.prayer.text }}>
                    Today is <Text style={{ fontWeight: "bold"}}>{weekday}</Text>, we pray the <Text style={{ fontStyle: "italic" }}>{mysteryType}</Text>.
                </Text>
                <Text style={{  marginTop: 6, color: theme.prayer.text }}>
                    {completed
                        ?   `You have prayed the rosary today.  🙏 Streak: ${streak} ${streak === 1 ? "day" : "days"}`
                        :   "You haven't prayed the rosary today. Want to pray now?"
                    }
                </Text>
                <Text style={{ marginTop: 8, color: theme.prayer.text, textAlign: "right" }}>
                    {completed ? "Tap to reflect more" : "Tap to begin praying →"}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default RosaryStatusBanner;