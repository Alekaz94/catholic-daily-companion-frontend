/* import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { DailyReading } from "../models/DailyReading";
import { getWeeklyReading } from "../services/DailyReadingService";
import { TouchableOpacity, View, Text, ActivityIndicator} from "react-native";
import DailyReadingDetailModal from "../components/DailyReadingDetailModal";
import Navbar from "../components/Navbar";
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import { AppTheme } from "../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

type DailyReadingNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Reading"
>

const getWeekdayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
}

const getWeekNumber = (dateString: string) => {
    const date = new Date(dateString);
    const onejan = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - onejan.getTime()) / 86400000);
    return Math.ceil((days + onejan.getDay() + 1) / 7);
}

const DailyReadingScreen = () => {
    const [weeklyReadings, setWeeklyReadings] = useState<DailyReading[]>([]);
    const [selectedReading, setSelectedReading] = useState<DailyReading | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<DailyReadingNavigationProp>();

    const loadWeeklyReadings = async () => {
        try {
            setIsLoading(true);
            const res = await getWeeklyReading();
            setWeeklyReadings(res);
        } catch (error) {
            console.error("Error loading weekly readings'", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadWeeklyReadings();
    }, []);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#ADD8E6"}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: AppTheme.reading.background}]}>
            <Text style={[Typography.title, {alignSelf: "center", color: AppTheme.reading.text}]}>Mass readings</Text>

            <View style={{ padding: 16 }}>
                {weeklyReadings.length > 0 && (
                    <>
                        <Text style={[Typography.title, {textAlign: "center", marginBottom: 10}]}>
                            Week {getWeekNumber(weeklyReadings[0].createdAt)}
                        </Text>

                        <View style={{ flexDirection: "column", justifyContent: "center" }}>
                            {weeklyReadings.map(reading => (
                                <LinearGradient 
                                colors={['#ADD8E6', "#FFFFFF"]}
                                start={{x: 0, y: 0.5}}
                                end={{x: 1, y: 0.5}}
                                style={Layout.card}
                                key={reading.id}
                                >
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            marginHorizontal: 2,
                                            padding: 8,
                                            borderRadius: 6,
                                            borderWidth: 1,
                                        }}
                                        onPress={() => {
                                            setSelectedReading(reading);
                                            setModalVisible(true);
                                        }}
                                    >
                                        <Text style={{fontWeight: "bold", color: AppTheme.reading.text}}>
                                            {getWeekdayName(reading.createdAt)}
                                        </Text>
                                        <Text style={{color: AppTheme.reading.text}}>
                                            {new Date(reading.createdAt).getDate()}
                                        </Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            ))}
                        </View>
                    </>
                )}

                {isLoading && (
                    <ActivityIndicator size="large" color={AppTheme.reading.text} style={{ marginTop: 10 }} />
                )}

                {!isLoading && weeklyReadings.length === 0 && (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>
                            No readings found for this week.
                        </Text>
                        <TouchableOpacity onPress={loadWeeklyReadings}>
                            <Ionicons name="refresh-outline" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            
            <TouchableOpacity
                style={[Layout.button, {
                    marginTop: 20,
                    padding: 12,
                    backgroundColor: "#ADD8E6",
                    borderRadius: 6,
                    alignSelf: "center",
                    borderWidth: 1
                }]}
                onPress={() => navigation.navigate("PastReadings")}
            >
                <Text style={[Layout.buttonText, {alignSelf: "center", color: AppTheme.reading.text}]}>Show Past Readings</Text>
            </TouchableOpacity>

            <DailyReadingDetailModal 
                visible={modalVisible}
                reading={selectedReading}
                onClose={() => setModalVisible(false)}
            />
            </View>
        </SafeAreaView>
    );
}

export default DailyReadingScreen; */