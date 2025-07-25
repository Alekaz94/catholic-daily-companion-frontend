import React, { useEffect, useState } from "react";
import { JournalEntry, UpdateJournalEntry } from "../models/JournalEntry";
import { deleteEntry, getAllEntries, updateEntry } from "../services/JournalEntryService";
import { FlatList, TouchableOpacity, View, Text, StyleSheet, Button } from "react-native";
import EntryDetailModal from "../components/EntryDetailModal";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import JournalEntryUpdateModal from "../components/JournalEntryUpdateModal";
import { Ionicons } from '@expo/vector-icons';
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import Navbar from "../components/Navbar";
import NavbarJournal from "../components/NavbarJournal";
import { LinearGradient } from "expo-linear-gradient";

type JournalEntryListNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Journal"
>

const JournalEntryListScreen = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
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
        <View style={{flex: 1}}>
            <NavbarJournal />
            <View style={Layout.container}>
            <Text style={[Typography.title, {alignSelf: "center"}]}>Daily reflections</Text>
            <TouchableOpacity style={Layout.button} onPress={() => navigation.navigate("CreateJournalEntry")}>
                <Text style={Layout.buttonText}>New Journal Entry</Text>
            </TouchableOpacity>

            <FlatList 
                data={entries} 
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <LinearGradient 
                        colors={['rgba(255, 215, 0, 0.8)', "#ADD8E6"]}
                        start={{x: 0, y: 0.5}}
                        end={{x: 1, y: 0.5}}
                        style={[Layout.card, {marginTop: 10, borderRadius: 12, padding: 15}]}
                    >                        
                        <TouchableOpacity onPress={() => {
                            setSelectedEntry(item);
                            setModalVisible(true);
                        }}>
                            <Text style={Typography.label}>{item.title}</Text>
                            <Text style={Typography.body} numberOfLines={2}>{item.content}</Text>
                            <Text style={Typography.small}>{item.date}</Text>
                        </TouchableOpacity>
                        
                        <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 5}}>
                            <TouchableOpacity onPress={() => {
                                setEntryToEdit(item);
                                setEditModalVisible(true);
                                }}
                            >
                                <Ionicons name="pencil-outline" size={20} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
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
        </View>
    );
}

export default JournalEntryListScreen;