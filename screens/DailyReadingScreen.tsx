import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { DailyReading } from "../models/DailyReading";
import { getAllDailyReadings } from "../services/DailyReadingService";
import { FlatList, TouchableOpacity, View, Text, StyleSheet} from "react-native";
import DailyReadingDetailModal from "../components/DailyReadingDetailModal";
import Navbar from "../components/Navbar";
import NavbarReading from "../components/NavbarReading";
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";

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
        <View style={{flex: 1}}>
            <NavbarReading />
            <View style={Layout.container}>
            <Text style={[Typography.title, {alignSelf: "center"}]}>Readings</Text>
           <FlatList
                data={readings}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={styles.flatlistContainer}>
                        <TouchableOpacity onPress={() => {
                            setSelectedReading(item);
                            setModalVisible(true);
                        }}>
                          <Text style={styles.readingDate}>Reading from {item.createdAt}</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 10
    },
    readingDate: {
        fontSize: 14,
        marginTop: 4
    },
    flatlistContainer: { 
        padding: 6, 
        borderBottomWidth: 1,
        borderBottomColor: 
        "#ccc" 
    },
})

export default DailyReadingScreen;