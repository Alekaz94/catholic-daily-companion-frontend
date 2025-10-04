import React, { useEffect, useRef, useState } from "react";
import { Saint, UpdatedSaint } from "../models/Saint";
import { deleteSaint, getAllSaints, searchSaints, updateSaint } from "../services/SaintService";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, FlatList, TouchableOpacity, Text, Image, Dimensions, Modal, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import SaintDetailModal from "../components/SaintDetailModal";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import Navbar from "../components/Navbar";
import { TextInput } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "../context/AuthContext";
import SaintUpdateModal from "../components/SaintUpdateModal";
import { useNavigation } from "@react-navigation/native";
import { buildImageUri } from "../utils/imageUtils";
import defaultSaint from "../assets/images/default_saint.jpg";
import Divider from "../components/Divider";
import { useAppTheme } from "../hooks/useAppTheme";

type SaintNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Saint"
>

const SaintScreen = () => {
    const { user } = useAuth();
    const theme = useAppTheme();
    const [saints, setSaints] = useState<Saint[]>([]);
    const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isVisibleDelete, setIsVisibleDelete] = useState(false);
    const [saintToDelete, setSaintToDelete] = useState<string | null>(null);
    const [saintToEdit, setSaintToEdit] = useState<Saint | null>(null);
    const [editSaintModalVisible, setEditSaintModalVisible] = useState(false);
    const navigation = useNavigation<SaintNavigationProp>();
    const screenWidth = Dimensions.get('window').width;
    const spacing = 16;
    const cardWidth = (screenWidth - 3 * spacing) / 2;
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

    const handleDelete = async (id: string) => {
        try {
            await deleteSaint(id);
            setSaints(prev => prev.filter(saint => saint.id !== id));
            setIsVisibleDelete(false);
            setSaintToDelete(null)
        } catch (error) {
            console.log("Failed to delete saint ", error)
        }
    }

    const handleUpdate = async (id: string, saintToUpdate: UpdatedSaint) => {
        try {
            await updateSaint(id, saintToUpdate);
            refreshSaints();
        } catch (error) {
            console.error("Failed to update saint ", error);
        }
    }

    const refreshSaints = async () => {
        try {
            setIsLoading(true);
            const res = isSearching 
            ? await searchSaints(searchQuery, page, 5)
            : await getAllSaints(page, 5);
            setSaints(res.content);
            setPage(page);
            setHasMore(!res.last);
        } catch (error) {
            console.error("Error refreshing saints ", error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.navbar}}>
            <Navbar />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[Layout.container, {backgroundColor: theme.auth.background}]}>
                <Text style={[Typography.italic, {textAlign: "center", fontSize: 22, fontWeight: "600", color: theme.saint.text}]}>Saints of the Catholic Church</Text>
                <Divider />
                {user?.role === "ADMIN" && (
                    <TouchableOpacity style={[Layout.button, {marginBottom: 10, backgroundColor: theme.saint.navbar}]} onPress={() => navigation.navigate("CreateSaint")}>
                        <Text style={[Layout.buttonText, {color: theme.saint.text}]}>Create new Saint</Text>
                    </TouchableOpacity>
                )}
                <View style={[Layout.searchInputView, {marginTop: 10}]}>
                    <Ionicons name="search-outline" size={20} color="#888" style={{ marginRight: 8 }} />
                    <TextInput 
                        style={Layout.searchInputTextInput} 
                        placeholder="Search saint by name..." 
                        value={searchQuery} 
                        onChangeText={(text) => {setSearchQuery(text)}}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {searchQuery !== "" && (
                        <TouchableOpacity onPress={clearSearch}>
                            <Ionicons name="close-circle" size={20} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
                <Divider />
                {page === 0 && isLoading ? (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator size="large" color={theme.saint.text} />
                        </View> 
                ) : (
                    <FlatList
                        ref={listRef}
                        data={saints}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        columnWrapperStyle={{justifyContent: "space-between", marginBottom: spacing}}
                        contentContainerStyle={{ paddingBottom: 20}}
                        renderItem={({item}) => (
                            <View style={{width: cardWidth}}>
                            <LinearGradient 
                                    colors={[theme.saint.cardOne, theme.saint.cardTwo]}
                                    start={{x: 0, y: 0.5}}
                                    end={{x: 1, y: 0.5}}
                                    style={Layout.card}
                                >
                                <TouchableOpacity onPress={() => {
                                    setSelectedSaint(item);
                                    setModalVisible(true);
                                    }}
                                    style={{ alignItems: "center" }}
                                >
                                    {item.imageUrl ? (
                                        <Image 
                                            style={[Layout.image, {width: cardWidth}]} 
                                            source={{  uri: buildImageUri(item.imageUrl)  }}
                                            defaultSource={defaultSaint}
                                        /> 
                                    ) : (
                                        <Image style={[Layout.image, {width: cardWidth}]} source={defaultSaint}/> 
                                    )}
                                    <Text style={[Typography.label, {color: theme.saint.text, textAlign: "center", marginTop: 8}]}>{item.name}</Text>
                                </TouchableOpacity>

                                {user?.role === "ADMIN" && (
                                    <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10}}>
                                        <TouchableOpacity onPress={() => {
                                            setSaintToEdit(item);
                                            setEditSaintModalVisible(true);
                                        }}
                                        style={{alignSelf: "flex-start"}}
                                        >
                                            <Ionicons name="pencil-outline" size={20} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            setIsVisibleDelete(true);
                                            setSaintToDelete(item.id)
                                        }}>
                                            <Ionicons name="trash-outline" size={20} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </LinearGradient>
                            <Divider />
                            </View>
                        )}
                        onEndReached={() => {
                            if(!isLoading && hasMore) {
                                setPage(prev => prev + 1)
                            }
                        }}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={ isLoading && page > 0 
                            ? (
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                                    <ActivityIndicator size="small" color={theme.saint.text} />
                                    <Text style={{ marginLeft: 10, color: theme.saint.text }}>Loading more...</Text>
                                </View> 
                            ) 
                            : !hasMore 
                            ? <Text style={{textAlign: 'center', marginTop: 10, color: theme.saint.text}}>No more saints to load</Text>
                            : null}
                    />
                )}

                <SaintDetailModal 
                    visible={modalVisible}
                    saint={selectedSaint}
                    onClose={() => {
                        setModalVisible(false)
                        setSelectedSaint(null)
                    }}
                />

                <SaintUpdateModal
                    visible={editSaintModalVisible}
                    saint={saintToEdit}
                    onClose={() => { 
                        setEditSaintModalVisible(false)
                        setSaintToEdit(null)
                    }}
                    onUpdate={handleUpdate}
                />
            </View>
            </TouchableWithoutFeedback>

            <Modal
                animationType="fade"
                transparent
                visible={isVisibleDelete}
                onRequestClose={() => setIsVisibleDelete(false)}
            >
                 <View style={[Layout.container, {width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.4)'}]}>
                    <View style={{alignItems: "center", padding: 20, width: "80%", backgroundColor: theme.saint.background, borderRadius: 12, borderColor: "black", borderWidth: 1}}>
                        <Text style={[Typography.title, { color: theme.saint.text }]}>Are you sure you want to delete this entry?</Text>
                        <View style={{flexDirection: "row"}}>
                            <TouchableOpacity
                                style={[Layout.button, {backgroundColor: Colors.success, width: "30%", marginRight: 20}]}
                                onPress={() => {
                                    if (saintToDelete) {
                                    handleDelete(saintToDelete);
                                    setIsVisibleDelete(false);
                                    setSaintToDelete(null);
                                  }}    
                                }
                            >
                                <Text style={[Typography.body, {color: theme.saint.text}]}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[Layout.button, {backgroundColor: Colors.error, width: "30%"}]}
                                onPress={() => {
                                    setIsVisibleDelete(false)
                                    setSaintToDelete(null)
                                }}
                            >
                                <Text style={[Typography.body, {color: theme.saint.text}]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

export default SaintScreen;
