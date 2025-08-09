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
    const [readings, setReadings] = useState<DailyReading[]>([]);
    const [selectedReading, setSelectedReading] = useState<DailyReading | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const fetchReadings = async () => {
        if(isLoading || !hasMore) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const res = await getAllDailyReadings(page, 10);
            setReadings(prev => [
                ...prev,
                ...res.content.filter((reading: DailyReading) => !prev?.some(r => r.id === reading.id)),
            ]);

            setHasMore(!res.last);
        } catch (error) {
            console.error("Error loading daily readings ", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setReadings([]);
        setPage(0);
        setHasMore(true);
    }, [])

    useEffect(() => {
        fetchReadings();
    }, [page])

    return (
        <SafeAreaView style={{flex: 1}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: AppTheme.reading.background}]}>
            <Text style={[Typography.title, {alignSelf: "center", color: AppTheme.reading.text}]}>Readings</Text>
           <FlatList
                data={readings}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={[Layout.card, {shadowColor: AppTheme.reading.navbar, marginBottom: 5, borderRadius: 4}]}>
                        <TouchableOpacity onPress={() => {
                            setSelectedReading(item);
                            setModalVisible(true);
                        }}>
                          <Text style={[Typography.small, {color: AppTheme.reading.text}]}>Reading from {item.createdAt}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                onEndReached={fetchReadings}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoading ? <Text>Loading more...</Text> : null}
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