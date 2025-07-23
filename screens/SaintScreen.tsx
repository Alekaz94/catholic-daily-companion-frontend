import React, { useEffect, useState } from "react";
import { Saint } from "../models/Saint";
import { getAllSaints, getSpecificSaint, createSaint } from "../services/SaintService";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import SaintDetailModal from "../components/SaintDetailModal";
import defaultSaintImage from '../assets/images/default_saint.png';
import { Colors } from "../styles/colors";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import Navbar from "../components/Navbar";
import NavbarSaint from "../components/NavbarSaint";

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
        <View style={{flex: 1}}>
            <NavbarSaint />
            <View style={Layout.container}>
            <Text style={[Typography.title, {alignSelf: "center"}]}>Saints of the Catholic Church</Text>
            <FlatList
                data={saints}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={Layout.card}>
                        <TouchableOpacity onPress={() => {
                            setSelectedSaint(item);
                            setModalVisible(true);
                        }}>
                            <Image style={Layout.image} source={item.imageUrl ? { uri: item.imageUrl } : defaultSaintImage} />
                            <Text style={Typography.label}>{item.name}</Text>
                            <Text style={Typography.small}>ca {item.birthYear} - ca {item.deathYear}</Text>
                            <Text style={Typography.body}>Patron of {item.patronage}</Text>
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
        </View>
    );
}

export default SaintScreen;
