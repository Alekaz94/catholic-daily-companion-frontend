import React, { useEffect, useRef, useState } from "react";
import { JournalEntry, UpdateJournalEntry } from "../models/JournalEntry";
import { deleteEntry, getAllEntries, updateEntry } from "../services/JournalEntryService";
import { FlatList, TouchableOpacity, View, Text, Modal, ActivityIndicator } from "react-native";
import EntryDetailModal from "../components/EntryDetailModal";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import JournalEntryUpdateModal from "../components/JournalEntryUpdateModal";
import { Ionicons } from '@expo/vector-icons';
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import Navbar from "../components/Navbar";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Divider from "../components/Divider";
import { useAppTheme } from "../hooks/useAppTheme";
import AdBanner from "../components/AdBanner";
import { cacheJournalEntries, getCachedEntries } from "../services/CacheService";

type JournalEntryListNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Journal"
>

const JournalEntryListScreen = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [isVisibleDelete, setIsVisibleDelete] = useState(false);
    const [entryToDeleteId, setEntryToDeleteId] = useState<string | null>(null);
    const [entryToEdit, setEntryToEdit] = useState<JournalEntry | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<JournalEntryListNavigationProp>();
    const theme = useAppTheme();
    const isFirstLoad = useRef(true);

    const handleDelete = async (id: string) => {
        try {
            await deleteEntry(id);
            setEntries(prev => {
                const updated = prev.filter(entry => entry.id !== id);
                cacheJournalEntries(updated);
                return updated;
            });
            setIsVisibleDelete(false);
            setEntryToDeleteId(null)
        } catch (error) {
            console.log("Failed to delete entry ", error)
        }
    }

    const handleUpdate = async (id: string, entryToUpdate: UpdateJournalEntry) => {
        try {
            await updateEntry(id, entryToUpdate);
            refreshEntries();
        } catch (error) {
            console.error("Failed to update entry", error);
        }
    }

    const refreshEntries = async () => {
        try {
            setIsLoading(true);
            const res = await getAllEntries(0, 10, "desc");
            setEntries(res.content);
            await cacheJournalEntries(res.content);
            setPage(0);
            setHasMore(!res.last);
        } catch (error) {
            console.error("Error refreshing entries ", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const loadCached = async () => {
            const cached = await getCachedEntries();
            if (cached && cached.length > 0) {
                setEntries(cached);
            }
        };
    
        loadCached();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            if (!isFirstLoad.current) {
                refreshEntries();
            }
            isFirstLoad.current = false;
        });
        return unsubscribe;
    }, [navigation])

    useEffect(() => {
        const load = async () => {
            if(isLoading || !hasMore) {
                return;
            }
            setIsLoading(true);
    
            try {
                const res = await getAllEntries(page, 10, "desc");
                if(page === 0) {
                    setEntries(res.content);
                    await cacheJournalEntries(res.content);
                } else {
                    setEntries(prev => {
                        const merged = [
                            ...prev,
                            ...res.content.filter((entry: JournalEntry) => !prev.some(e => e.id === entry.id)),
                        ];
                        
                        cacheJournalEntries(merged);
                        return merged;
                    });
                }

                setHasMore(!res.last);
            } catch (error) {
                console.error("Error loading journal entries ", error);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [page]);

    return (
        <>
        <SafeAreaView style={{flex: 1, backgroundColor: theme.journal.primary}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: theme.journal.background}]}>
                <Text style={[Typography.italic, {textAlign: "center", fontSize: 22, fontWeight: "600", color: theme.prayer.text}]}>Daily reflections</Text>
                <Divider />
                <TouchableOpacity 
                    style={[
                        Layout.button, {
                            marginBottom: 10, 
                            backgroundColor: theme.journal.primary, 
                            flexDirection: "row", 
                            justifyContent: "center", 
                            borderWidth: 1,
                            opacity: isLoading ? 0.7 : 1 
                        }]} 
                    onPress={() => navigation.navigate("CreateJournalEntry")}
                    disabled={isLoading} 
                >
                    {isLoading ? (
                        <ActivityIndicator color={theme.journal.text} />
                    ) : (
                        <>
                            <Ionicons name="create-outline" size={20} color={theme.journal.text}/>
                            <Text style={[Layout.buttonText, {color: theme.journal.text, marginLeft: 10}]}>Create Journal Entry</Text>
                        </>
                    )}
                </TouchableOpacity>
                {page === 0 && isLoading ? (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="gray" />
                    </View> 
                ) : ( entries.length === 0 ? (
                        <View>
                            <Text style={[Typography.label, {textAlign: 'center', fontSize: 16, marginTop: 10, color: theme.journal.smallText}]}>You have not made a journal entry.</Text>
                            <Text style={[Typography.label, {textAlign: 'center', fontSize: 16, marginTop: 5, color: theme.journal.smallText}]}>Create your first entry by clicking the button 'Create Journal Entry' above.</Text>
                        </View>
                    ): (
                        <FlatList 
                        data={entries} 
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <LinearGradient
                                colors={[theme.journal.cardOne, theme.journal.cardTwo]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[Layout.card, {
                                    borderRadius: 12,
                                    borderColor: theme.journal.background,
                                    padding: 16,
                                    marginVertical: 8,
                                    shadowRadius: 6,
                                    elevation: 3, 
                                }]}
                                >
                                <TouchableOpacity 
                                    onPress={() => {
                                        setSelectedEntry(item);
                                        setModalVisible(true);
                                    }}
                                    disabled={isLoading}
                                >
                                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                        <Text style={[Typography.label, {color: theme.journal.text, fontWeight: "bold"}]}>{item.title}</Text>
                                        <Text style={[Typography.label, {color: theme.journal.text}]}>{item.date}</Text>
                                    </View>
                                    <Text style={[Typography.body, {color: theme.journal.text, fontSize: 18, marginBottom: 5}]} numberOfLines={2}>{item.content}</Text>
                                </TouchableOpacity>
                                
                                <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 5}}>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            setEntryToEdit(item);
                                            setEditModalVisible(true);
                                        }}
                                        disabled={isLoading} 
                                    >
                                        <Ionicons name="pencil-outline" size={20} color={theme.journal.text}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        onPress={() => {
                                            setIsVisibleDelete(true);
                                            setEntryToDeleteId(item.id);
                                        }} 
                                        disabled={isLoading} 
                                    >
                                        <Ionicons name="trash-outline" size={20} color="red" />
                                    </TouchableOpacity>  
                                </View>
                            </LinearGradient>
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
                                    <ActivityIndicator size="small" color={theme.journal.text} />
                                    <Text style={{ marginLeft: 10, color: theme.journal.text }}>Loading more...</Text>
                                </View> 
                            ) 
                            : !hasMore 
                            ? <Text style={{textAlign: 'center', marginTop: 10, color: theme.journal.text}}>No more entries</Text>
                            : null}
                    />
                    )
                )}
                

                <EntryDetailModal 
                    visible={modalVisible}
                    entry={selectedEntry}
                    onClose={() => {
                        setModalVisible(false)
                        setSelectedEntry(null)
                    }}
                />

                <JournalEntryUpdateModal 
                    visible={editModalVisible}
                    entry={entryToEdit}
                    onClose={() => { 
                        setEditModalVisible(false)
                        setEntryToEdit(null)
                    }}
                    onUpdate={handleUpdate}
                />
                </View>
                <AdBanner />
            </SafeAreaView>

            <Modal
                animationType="fade"
                transparent
                visible={isVisibleDelete}
                onRequestClose={() => setIsVisibleDelete(false)}
            >
                 <View style={[Layout.container, {width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.4)'}]}>
                    <View style={{alignItems: "center", padding: 20, width: "80%", backgroundColor: theme.journal.background, borderRadius: 12, borderColor: theme.journal.text, borderWidth: 1}}>
                        <Text style={[Typography.title, {color: theme.journal.text}]}>Are you sure you want to delete this entry?</Text>
                        <View style={{flexDirection: "row"}}>
                            <TouchableOpacity
                                style={[Layout.button, {backgroundColor: Colors.success, width: "30%", marginRight: 20}]}
                                onPress={() => {
                                    if (entryToDeleteId) {
                                    handleDelete(entryToDeleteId);
                                    setIsVisibleDelete(false);
                                    setEntryToDeleteId(null);
                                  }}    
                                }
                            >
                                <Text style={[Typography.body, { color: theme.journal.text }]}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[Layout.button, {backgroundColor: Colors.error, width: "30%"}]}
                                onPress={() => setIsVisibleDelete(false)}
                            >
                                <Text style={[Typography.body, {color: theme.journal.text}]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export default JournalEntryListScreen;