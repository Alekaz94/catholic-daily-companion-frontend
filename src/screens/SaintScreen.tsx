import React, { useEffect, useRef, useState } from "react";
import { Saint } from "../models/Saint";
import { getAllSaints, searchSaints } from "../services/SaintService";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, FlatList, TouchableOpacity, Text, Image, Dimensions } from "react-native";
import SaintDetailModal from "../components/SaintDetailModal";
import defaultSaintImage from '../assets/images/default_saint.png';
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import Navbar from "../components/Navbar";
import { TextInput } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { AppTheme } from "../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";

type SaintNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Saint"
>

const SaintScreen = () => {
    const [saints, setSaints] = useState<Saint[]>([]);
    const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = (screenWidth - 5 * 12) / 2;
    const listRef = useRef<FlatList>(null);

    const fetchSaints = async () => {
        if(isLoading || !hasMore) {
            return;
        }

        setIsLoading(true);

        try {
            const res = isSearching 
                ? await searchSaints(searchQuery, page, 5)
                : await getAllSaints(page, 5);

            setSaints(prev => [
            ...prev,
            ...res.content.filter((s: Saint) => !prev.some(p => p.id === s.id)),
            ]);

            setHasMore(!res.last);
        } catch (error) {
            console.error("Error loading saints:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim() === "") {
            return;
        }
        setIsSearching(true);
        setPage(0);
        setSaints([]);
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    const clearSearch = async () => {
        setSearchQuery("");
        setIsSearching(false);
        setSaints([]);
        setPage(0);
        setHasMore(true);
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }

    useEffect(() => {
        setSaints([]);
        setPage(0);
        setHasMore(true);
    }, [isSearching]);

    useEffect(() => {
        fetchSaints();
    }, [page, isSearching]);

    useEffect(() => {
    if (searchQuery.trim() === "") {
        clearSearch();
    }
    }, [searchQuery]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#FAF3E0"}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: "#F0F9FF"}]}>
            <Text style={[Typography.title, {alignSelf: "center", color: AppTheme.saint.text}]}>Saints of the Catholic Church</Text>
            <TextInput 
                style={Layout.input} 
                placeholder="Search saint by name..." 
                value={searchQuery} 
                onChangeText={(text) => {setSearchQuery(text)}}
                onSubmitEditing={handleSearch} 
            />
            <TouchableOpacity style={{marginBottom: 20, marginTop: -10}} onPress={clearSearch}>
                <Text style={Typography.link}>Clear search</Text>
            </TouchableOpacity>
            <FlatList
                ref={listRef}
                data={saints}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={{justifyContent: "space-between", marginBottom: 10}}
                contentContainerStyle={{ paddingBottom: 20}}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => {
                        setSelectedSaint(item);
                        setModalVisible(true);
                        }}
                        style={{width: cardWidth, margin: 5}}
                    >
                        <LinearGradient 
                            colors={['#FAF3E0', "#F0F9FF"]}
                            start={{x: 0, y: 0.5}}
                            end={{x: 1, y: 0.5}}
                            style={[Layout.card, {padding: 12, borderRadius: 12, alignItems: "center"}]}
                        >
                            <Image style={Layout.image} source={item.imageUrl ? { uri: item.imageUrl } : defaultSaintImage} />
                            <Text style={[Typography.label, {color: AppTheme.saint.text}]}>{item.name}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                )}
                onEndReached={() => {
                    if(!isLoading && hasMore) {
                        setPage(prev => prev + 1)
                    }
                }}
                onEndReachedThreshold={0.2}
                ListFooterComponent={isLoading ? 
                    (<Text>Loading...</Text>) 
                    : !hasMore 
                    ? (<Text style={{textAlign: 'center', marginTop: 10}}>No more saints to load</Text>) 
                    : null}
            />

            <SaintDetailModal 
                visible={modalVisible}
                saint={selectedSaint}
                onClose={() => setModalVisible(false)}
            />
            </View>
        </SafeAreaView>
    );
}

export default SaintScreen;
