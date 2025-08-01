import React, { useEffect, useState } from "react";
import { JournalEntry, UpdateJournalEntry } from "../models/JournalEntry";
import { deleteEntry, getAllEntries, updateEntry } from "../services/JournalEntryService";
import { FlatList, TouchableOpacity, View, Text, Modal, SafeAreaView } from "react-native";
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
import { AppTheme, Colors } from "../styles/colors";

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
    const navigation = useNavigation<JournalEntryListNavigationProp>();

    const fetchEntries = async () => {
        const data = await getAllEntries();
        setEntries(data);
    }

    const handleDelete = async (id: string) => {
        await deleteEntry(id);
        fetchEntries();
    }

    const handleUpdate = async (id: string, entryToUpdate: UpdateJournalEntry) => {
        await updateEntry(id, entryToUpdate);
        fetchEntries();
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchEntries();
        });
        return unsubscribe;
    }, [navigation])

    return (
        <>
        <SafeAreaView style={{flex: 1}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: AppTheme.journal.background}]}>
                <Text style={[Typography.title, {alignSelf: "center", color: AppTheme.journal.text}]}>Daily reflections</Text>
                <TouchableOpacity style={Layout.button} onPress={() => navigation.navigate("CreateJournalEntry")}>
                    <Text style={Layout.buttonText}>New Journal Entry</Text>
                </TouchableOpacity>

                <FlatList 
                    data={entries} 
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <LinearGradient
                            colors={['#B794F4', '#F5F3FF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[Layout.card, {
                                borderRadius: 12,
                                borderColor: AppTheme.journal.background,
                                padding: 16,
                                marginVertical: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 6,
                                elevation: 3, 
                            }]}
                            >
                            <TouchableOpacity onPress={() => {
                                setSelectedEntry(item);
                                setModalVisible(true);
                            }}>
                                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                    <Text style={[Typography.label, {color: AppTheme.journal.text}]}>{item.title}</Text>
                                    <Text style={[Typography.small, {color: AppTheme.journal.text}]}>{item.date}</Text>
                                </View>
                                <Text style={[Typography.body, {color: AppTheme.journal.text}]} numberOfLines={2}>{item.content}</Text>
                            </TouchableOpacity>
                            
                            <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 5}}>
                                <TouchableOpacity onPress={() => {
                                    setEntryToEdit(item);
                                    setEditModalVisible(true);
                                    }}
                                >
                                    <Ionicons name="pencil-outline" size={20} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setIsVisibleDelete(true);
                                    setEntryToDeleteId(item.id);
                                }}>
                                    <Ionicons name="trash-outline" size={20} color="red" />
                                </TouchableOpacity>  
                            </View>
                        </LinearGradient>
                    )}
                />

                <EntryDetailModal 
                    visible={modalVisible}
                    entry={selectedEntry}
                    onClose={() => setModalVisible(false)} 
                />

                <JournalEntryUpdateModal 
                    visible={editModalVisible}
                    entry={entryToEdit}
                    onClose={() => setEditModalVisible(false)}
                    onUpdate={handleUpdate}
                />
                </View>
            </SafeAreaView>

            <Modal
                animationType="fade"
                transparent
                visible={isVisibleDelete}
                onRequestClose={() => setIsVisibleDelete(false)}
            >
                 <View style={[Layout.container, {width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.4)'}]}>
                    <View style={{alignItems: "center", padding: 20, width: "80%", backgroundColor: AppTheme.journal.background, borderRadius: 12, borderColor: "black", borderWidth: 1}}>
                        <Text style={Typography.title}>Are you sure you want to delete this entry?</Text>
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
                                <Text style={Typography.body}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[Layout.button, {backgroundColor: "gray", width: "30%"}]}
                                onPress={() => setIsVisibleDelete(false)}
                            >
                                <Text style={Typography.body}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export default JournalEntryListScreen;