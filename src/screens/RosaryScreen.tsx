import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { completeToday, getHistory, getStreak, isCompletedToday } from "../services/RosaryService";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/Navbar";
import { Typography } from "../styles/Typography";
import CheckBox from "expo-checkbox"
import { createMysteryDecade, fixedRosaryEnd, fixedRosaryStart, getTodaysMysteries, RosaryStep } from "../data/RosarySequence";
import { Layout } from "../styles/Layout";
import { Rosary } from "../models/Rosary";
import { AppTheme } from "../styles/colors";
import * as SecureStore from 'expo-secure-store';
import RosaryHistoryModal from "../components/RosaryHistoryModal";

const formatDate = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const RosaryScreen = () => {
    const { user } = useAuth();
    const mysteries = getTodaysMysteries();
    const [historyModalVisible, setHistoryModalVisible] = useState(false);

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
            };
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

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ADD8E6'}}>
            <Navbar />
            <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1, backgroundColor: AppTheme.prayer.background}}>
                <Text style={[Typography.title, { marginBottom: 6, alignSelf: "center" }]}>Rosary</Text>
                {rosarySequence.map((step, stepIndex) => (
                    <View key={stepIndex} style={{marginBottom: 24}}>
                        {step.title && (
                            <Text style={[Typography.title, { marginBottom: 6}]}>
                                {step.title}
                            </Text>
                        )}
                        <Text style={[Typography.body, { marginBottom: 8, fontSize: 16 }]}>
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
                    </View>
                ))}

                <View style={{marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderColor: "#ccc"}}>
                    <Text style={[Typography.title, {marginBottom: 10, alignSelf: "center"}]}>Progress</Text>
                    <Text style={[Typography.body,{fontSize: 16}] }>Rosary completed today? {completed ? "Yes" : "No"}</Text>
                    <Text style={[Typography.body, {fontSize: 16}] }>Current Streak: {streak} {streak === 1 ? "day" : "days"}</Text>

                    <TouchableOpacity style={[Layout.button, {backgroundColor: '#ADD8E6', borderWidth: 1, marginTop: 20}]} onPress={handleComplete} disabled={completed}>
                        <Text style={[Layout.buttonText, {color: "black"}]}>Mark as Completed</Text>
                    </TouchableOpacity>

                    <Text style={[Typography.title, { marginTop: 16, marginBottom: -5, alignSelf: "center" }]}>History</Text>
                    <TouchableOpacity
                      onPress={() => setHistoryModalVisible(true)}
                      style={[Layout.button, {backgroundColor: "#ADD8E6", borderWidth: 1, borderColor: "black", marginBottom: 20}]}
                    >
                        <Text style={[Layout.buttonText, {alignSelf: "center", color: AppTheme.prayer.text}]}>📜 View Rosary History</Text>
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