import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { completeToday, getHistory, getStreak, isCompletedToday } from "../services/RosaryService";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/Navbar";
import { Typography } from "../styles/Typography";
import CheckBox from "expo-checkbox"
import { createMysteryDecade, fixedRosaryEnd, fixedRosaryStart, getMysteryTypeForToday, getTodaysMysteries, getWeekdayName, RosaryStep } from "../data/RosarySequence";
import { Layout } from "../styles/Layout";
import { Rosary } from "../models/Rosary";
import * as SecureStore from 'expo-secure-store';
import RosaryHistoryModal from "../components/RosaryHistoryModal";
import Divider from "../components/Divider";
import { useAppTheme } from "../hooks/useAppTheme";

const formatDate = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const RosaryScreen = () => {
    const { user } = useAuth();
    const theme = useAppTheme();
    const mysteries = useMemo(() => getTodaysMysteries(), []);
    const weekday = useMemo(() => getWeekdayName(new Date()), []);
    const mysteryType = useMemo(() => getMysteryTypeForToday(), []);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const rosarySequence: RosaryStep[] = [
        ...fixedRosaryStart,
        ...mysteries.flatMap(mystery => createMysteryDecade(mystery)),
        ...fixedRosaryEnd,
    ];

    const STORAGE_KEY = `rosary_progress_${user?.id}_${formatDate(new Date())}`;

    const [checkedSteps, setCheckedSteps] = useState<boolean[][]>(
        rosarySequence.map(step => Array(step.checkboxes).fill(false))
    );
    const [completed, setCompleted] = useState(false);
    const [streak, setStreak] = useState(0);
    const [history, setHistory] = useState<Rosary[]>([]);

    const allChecked = checkedSteps.every(step => step.every(checked => checked));

    useEffect(() => {
        if (!user?.id) {
            return;
        }
    
        const loadProgress = async () => {
          try {
            const saved = await SecureStore.getItemAsync(STORAGE_KEY);
            if (saved) {
              setCheckedSteps(JSON.parse(saved));
            }
          } catch (e) {
            console.warn("Failed to load rosary progress", e);
          }
        };
    
        loadProgress();
    }, [user, STORAGE_KEY, rosarySequence.length]);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const saveProgress = async () => {
          try {
            await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(checkedSteps));
          } catch (e) {
            console.warn("Failed to save rosary progress", e);
          }
        };
    
        saveProgress();
    }, [checkedSteps, user, STORAGE_KEY]);

    useEffect(() => {
        if(!user?.id) {
            return;
        }

        const fetchData = async () => {
            try {
                const done = await isCompletedToday(user.id);
                const currentStreak = await getStreak(user.id);
                const pastLogs = await getHistory(user.id);

                setCompleted(done);
                setStreak(currentStreak);
                setHistory(pastLogs);

                if(done) {
                    const allTrue = rosarySequence.map(step => Array(step.checkboxes).fill(true));
                    setCheckedSteps(allTrue);
                }
            } catch (error) {
                console.error("Failed to load rosary data ", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user, rosarySequence.length]);

    const toggleCheckbox = (stepIndex: number, boxIndex: number) => {
        setCheckedSteps(prev => {
            const updated = [...prev];
            updated[stepIndex][boxIndex] = !updated[stepIndex][boxIndex];
            return updated;
        });
    };

    const handleComplete = async () => {
        if(!user?.id) {
            return;
        }

        const allChecked = checkedSteps.every(step =>
            step.every(checked => checked)
        );

        if(!allChecked) {
            Alert.alert("Please check all boxes for each prayer.");
            return;
        }

        try {
            await completeToday(user.id);
            Alert.alert("Rosary marked as completed!");
            setCompleted(true);
            setStreak(prev => prev + 1);

            const allTrue = rosarySequence.map(step => Array(step.checkboxes).fill(true));
            setCheckedSteps(allTrue);
        } catch (error) {
            console.error("Failed to complete rosary ", error);
        }
    };

    if(isLoading) {
        return (
            <SafeAreaView>
                <ActivityIndicator size="large" color="#1E3A8A" />
                <Text style={[Typography.label, { marginTop: 10, color: theme.prayer.text }]}>Loading Rosary...</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.prayer.primary}}>
            <Navbar />
            <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1, backgroundColor: theme.prayer.background}}>
                <Text style={[Typography.italic, {textAlign: "center", fontSize: 22, fontWeight: "600", color: theme.prayer.text}]}>Rosary</Text>
                <Divider />
                <Text style={[Typography.italic, {textAlign: "center", fontSize: 18, color: theme.prayer.text}]}>Today, {weekday}, we pray the {mysteryType}</Text>
                <Divider />
                {rosarySequence.map((step, stepIndex) => (
                    <View key={stepIndex} style={{marginBottom: 24}}>
                        {step.title && (
                            <Text style={[Typography.title, { marginBottom: 12, fontSize: 20, color: theme.prayer.text}]}>
                                {step.title}
                            </Text>
                        )}
                        <Text style={[Typography.body, { marginBottom: 12, fontSize: 18, fontWeight: "600", color: theme.prayer.text }]}>
                            {step.prayerText}
                        </Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", alignContent: "center", justifyContent: "center"}}>
                            {checkedSteps[stepIndex].map((checked, boxIndex) => (
                                <CheckBox
                                    style={{marginHorizontal: 5}}
                                    key={boxIndex}
                                    value={checked}
                                    onValueChange={() => !completed && toggleCheckbox(stepIndex, boxIndex)}
                                    disabled={completed}
                                />
                            ))}
                        </View>
                        <Divider />
                    </View>
                ))}

                <View style={{marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderColor: "#ccc"}}>
                    <Text style={[Typography.italic, { marginBottom: 10, alignSelf: "center", fontSize: 20, color: theme.prayer.text }]}>Progress</Text>
                    <Text style={[Typography.body,{fontSize: 18, color: theme.prayer.text}] }>Rosary completed today? {completed ? "Yes" : "No"}</Text>
                    <Text style={[Typography.body, {fontSize: 18, color: theme.prayer.text}] }>Current Streak: {streak} {streak === 1 ? "day" : "days"}</Text>

                    <TouchableOpacity style={[Layout.button, {backgroundColor: theme.prayer.button, borderWidth: 1, marginTop: 20, marginBottom: 6}]} onPress={handleComplete} disabled={completed}>
                        <Text style={[Layout.buttonText, {color: theme.prayer.text}]}>Mark as Completed</Text>
                    </TouchableOpacity>
                    <Divider />
                    <Text style={[Typography.italic, { marginTop: 4, alignSelf: "center", fontSize: 20, color: theme.prayer.text }]}>History</Text>
                    <TouchableOpacity
                      onPress={() => setHistoryModalVisible(true)}
                      style={[Layout.button, {backgroundColor: theme.prayer.button, borderWidth: 1, marginBottom: 20}]}
                    >
                        <Text style={[Layout.buttonText, {alignSelf: "center", color: theme.prayer.text}]}>📜 View Rosary History</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <RosaryHistoryModal 
                visible={historyModalVisible}
                onClose={() => setHistoryModalVisible(false)}
                history={history}
            />
        </SafeAreaView>
    );
}

export default RosaryScreen;