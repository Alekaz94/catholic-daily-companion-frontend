import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { DailyReading } from "../models/DailyReading";
import { getAllDailyReadings } from "../services/DailyReadingService";
import { FlatList, TouchableOpacity, View, Text, SafeAreaView} from "react-native";
import DailyReadingDetailModal from "../components/DailyReadingDetailModal";
import Navbar from "../components/Navbar";
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import { AppTheme } from "../styles/colors";

type DailyReadingNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Reading"
>

const DailyReadingScreen = () => {
    const [readings, setReadings] = useState<DailyReading[] | null>([]);
    const [selectedReading, setSelectedReading] = useState<DailyReading | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchReadings = async () => {
        const data = await getAllDailyReadings();
        setReadings(data);
    }

    useEffect(() => {
        fetchReadings();
    }, [])

    return (
        <SafeAreaView style={{flex: 1}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: AppTheme.reading.background}]}>
            <Text style={[Typography.title, {alignSelf: "center", color: AppTheme.reading.text}]}>Readings</Text>
           <FlatList
                data={readings}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={Layout.card}>
                        <TouchableOpacity onPress={() => {
                            setSelectedReading(item);
                            setModalVisible(true);
                        }}>
                          <Text style={[Typography.small, {color: AppTheme.reading.text}]}>Reading from {item.createdAt}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <DailyReadingDetailModal 
                visible={modalVisible}
                reading={selectedReading}
                onClose={() => setModalVisible(false)}
            />
            </View>
        </SafeAreaView>
    );
}

export default DailyReadingScreen;