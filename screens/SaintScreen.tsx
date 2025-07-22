import React, { useEffect, useState } from "react";
import { Saint } from "../models/Saint";
import { getAllSaints, getSpecificSaint, createSaint } from "../services/SaintService";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import SaintDetailModal from "../components/SaintDetailModal";
import defaultSaintImage from '../assets/images/default_saint.png';

type SaintNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Saint"
>

const SaintScreen = () => {
    const [saints, setSaints] = useState<Saint[] | null>([]);
    const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchSaints = async () => {
        const data = await getAllSaints();
        setSaints(data);
    }

    useEffect(() => {
        fetchSaints();
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Saints of the Catholic Church</Text>
            <FlatList
                data={saints}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={styles.flatlistContainer}>
                        <TouchableOpacity onPress={() => {
                            setSelectedSaint(item);
                            setModalVisible(true);
                        }}>
                            <Image style={styles.saintImage} source={item.imageUrl ? { uri: item.imageUrl } : defaultSaintImage} />
                            <Text style={styles.saintName}>{item.name}</Text>
                            <Text style={styles.saintDate}>ca {item.birthYear} - ca {item.deathYear}</Text>
                            <Text numberOfLines={1}>{item.biography}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <SaintDetailModal 
                visible={modalVisible}
                saint={selectedSaint}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        margin: 10
    },
    saintName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    saintDate: {
        fontSize: 10,
        color: "gray",
        marginTop: 4
    },
    flatlistContainer: { 
        padding: 6, 
        borderBottomWidth: 1,
        borderBottomColor: 
        "#ccc" 
    },
    saintImage: { 
        width: 100, 
        height: 100, 
        borderRadius: 50 
    },
})

export default SaintScreen;
