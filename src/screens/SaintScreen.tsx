import React, { useEffect, useRef, useState } from "react";
import { Saint, UpdatedSaint } from "../models/Saint";
import { deleteSaint, getAllSaints, searchSaints, updateSaint } from "../services/SaintService";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, FlatList, TouchableOpacity, Text, Image, Dimensions, Modal, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import SaintDetailModal from "../components/SaintDetailModal";
import { Layout } from "../styles/Layout";
import { useTypography } from "../styles/Typography";
import Navbar from "../components/Navbar";
import { TextInput } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import SaintUpdateModal from "../components/SaintUpdateModal";
import { useNavigation } from "@react-navigation/native";
import { buildImageUri } from "../utils/imageUtils";
import defaultSaint from "../assets/images/default_saint.jpg";
import Divider from "../components/Divider";
import { useAppTheme } from "../hooks/useAppTheme";
import { cacheSaints, getCachedSaints } from "../services/CacheService";
import AdBanner from "../components/AdBanner";
import { useRequireAuth } from "../hooks/useRequireAuth";

type SaintNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Saint"
>

const SaintScreen = () => {
    const user = useRequireAuth();
    const theme = useAppTheme();

    if(!user) {
        return null;
    }

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
    const Typography = useTypography();

    const fetchSaints = async (reset = false) => {
        if(isLoading || !hasMore && !reset) {
            return;
        }

        setIsLoading(true);

        try {
            const currentPage = reset ? 0 : page;
            const res = isSearching 
                ? await searchSaints(searchQuery, currentPage, 5)
                : await getAllSaints(currentPage, 5);

            if (!res || !res.content) {
                console.warn("No saints returned (likely expired session)");
                setHasMore(false);
                return;
            }

            const newData = res.content || [];

            if(reset || currentPage === 0) {
                setSaints(newData);
            } else {
                setSaints((prev) => [
                    ...prev,
                    ...newData.filter((s: Saint) => !prev.some((p) => p.id === s.id)),
                ]);
            }

            setHasMore(!res.last);

            if(!isSearching && currentPage === 0) {
                await cacheSaints(newData);
            }
        } catch (error) {
            console.error("Error loading saints:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadCachedData = async () => {
            const cached = await getCachedSaints();
            if (cached && cached.length > 0) {
                setSaints(cached);
            } else {
                fetchSaints(true);
            }
        };
        loadCachedData();
    }, [user]);

    useEffect(() => {
        if (page > 0) {
            fetchSaints()
        };
    }, [page, user]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const isActiveSearch = searchQuery.trim().length > 0;
            setIsSearching(isActiveSearch);
            setPage(0);
            fetchSaints(true);
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchQuery, user]);

    const clearSearch = () => {
        setSearchQuery("");
        setIsSearching(false);
        setPage(0);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSaint(id);
            const updated = saints.filter(s => s.id !== id);
            setSaints(updated);
            await cacheSaints(updated);
        } catch (error) {
            console.log("Failed to delete saint ", error)
        } finally {
            setIsVisibleDelete(false);
            setSaintToDelete(null);
        }
    }

    const handleUpdate = async (id: string, saintToUpdate: UpdatedSaint) => {
        try {
            await updateSaint(id, saintToUpdate);
            const res = isSearching
                ? await searchSaints(searchQuery, page, 5)
                : await getAllSaints(page, 5);
            
            if (!res || !res.content) return;

            setSaints(res.content);
            await cacheSaints(res.content);
        } catch (error) {
            console.error("Failed to update saint ", error);
        } finally {
            setEditSaintModalVisible(false);
            setSaintToEdit(null);
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.navbar}}>
            <Navbar />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[Layout.container, {backgroundColor: theme.auth.background}]}>
                <Text style={[Typography.title, {textAlign: "center", fontWeight: "600", color: theme.saint.text}]}>Saints of the Catholic Church</Text>
                <Divider />
                {user?.role === "ADMIN" && (
                    <TouchableOpacity style={[Layout.button, {marginBottom: 10, backgroundColor: theme.saint.navbar}]} onPress={() => navigation.navigate("CreateSaint")}>
                        <Text style={[Typography.label, {color: "black"}]}>Create new Saint</Text>
                    </TouchableOpacity>
                )}
                <View style={[Layout.searchInputView, {marginTop: 10}]}>
                    <Ionicons name="search-outline" size={20} color="#888" style={{ marginRight: 8 }} />
                    <TextInput 
                        style={Layout.searchInputTextInput} 
                        placeholder="Search saint by name..." 
                        value={searchQuery} 
                        onChangeText={(text) => {setSearchQuery(text)}}
                        returnKeyType="search"
                        placeholderTextColor={"black"}
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
                                    colors={[theme.saint.detail, theme.saint.detail]}
                                    start={{x: 0, y: 0.5}}
                                    end={{x: 1, y: 0.5}}
                                    style={[Layout.card]}
                                >
                                <TouchableOpacity onPress={() => {
                                    setSelectedSaint(item);
                                    setModalVisible(true);
                                    }}
                                    style={{ alignItems: "center", justifyContent: "center" }}
                                >
                                    {item.imageUrl ? (
                                        <Image 
                                            style={[Layout.image, {width: (cardWidth - 5)}]} 
                                            source={{  uri: buildImageUri(item.imageUrl)  }}
                                            defaultSource={defaultSaint}
                                        /> 
                                    ) : (
                                        <Text style={[Typography.label, Layout.image, {color: theme.saint.text, padding: 20, textAlign: "center", width: cardWidth}]}>Image not available for {item.name}</Text>
                                    )}
                                    <Text style={[Typography.label, {color: theme.saint.text, textAlign: "center", marginTop: 8, width: cardWidth - 10}]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                                </TouchableOpacity>

                                {user?.role === "ADMIN" && (
                                    <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10}}>
                                        <TouchableOpacity onPress={() => {
                                            setSaintToEdit(item);
                                            setEditSaintModalVisible(true);
                                        }}
                                        >
                                            <Ionicons color={theme.saint.text} name="pencil-outline" size={20} />
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
            <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
                <AdBanner />
            </View>
        </SafeAreaView>
    );
}

export default SaintScreen;
