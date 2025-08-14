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

const RosaryScreen = () => {
    const { user } = useAuth();
    const mysteries = getTodaysMysteries();
    const rosarySequence: RosaryStep[] = [
        ...fixedRosaryStart,
        ...mysteries.flatMap(mystery => createMysteryDecade(mystery)),
        ...fixedRosaryEnd,
    ];
    const [checkedSteps, setCheckedSteps] = useState<boolean[][]>(
        rosarySequence.map(step => Array(step.checkboxes).fill(false))
    );
    const [completed, setCompleted] = useState(false);
    const [streak, setStreak] = useState(0);
    const [history, setHistory] = useState<Rosary[]>([]);

    const allChecked = checkedSteps.every(step => {
        step.every(checked => checked === true)
    })

    const toggleCheckbox = (stepIndex: number, boxIndex: number) => {
        setCheckedSteps(prev => {
            const updated = [...prev];
            updated[stepIndex][boxIndex] = !updated[stepIndex][boxIndex];
            return updated;
        });
    };

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
            } catch (error) {
                console.error("Failed to load rosary data ", error);
            };
        };
        fetchData();
    }, [user]);

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
        } catch (error) {
            console.error("Failed to complete rosary ", error);
        }
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#B794F4"}}>
            <Navbar />
            <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1, backgroundColor: AppTheme.journal.background}}>
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
                                    onValueChange={() => toggleCheckbox(stepIndex, boxIndex)}
                                />
                            ))}
                        </View>
                    </View>
                ))}

                <View style={{marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderColor: "#ccc"}}>
                    <Text style={[Typography.title, {marginBottom: 8, alignSelf: "center"}]}>Progress</Text>
                    <Text style={[Typography.body,{fontSize: 16}] }>Rosary completed today? {completed ? "Yes" : "No"}</Text>
                    <Text style={[Typography.body, {fontSize: 16}] }>Current Streak: {streak} days</Text>

                    <TouchableOpacity style={Layout.button} onPress={handleComplete} disabled={completed}>
                        <Text style={Layout.buttonText}>Mark as Completed</Text>
                    </TouchableOpacity>

                    <Text style={[Typography.title, { marginTop: 16, alignSelf: "center" }]}>History</Text>
                    {history.map((entry) => (
                        <Text key={entry.id} style={[Typography.body, {fontSize: 16}]}>
                            {new Date(entry.date).toLocaleString()} - {entry.completed ? "✅" : "❌"}
                        </Text>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default RosaryScreen;