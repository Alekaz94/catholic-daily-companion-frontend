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
        <View style={styles.container}>
            <Button title="New Journal Entry" onPress={() => {
                navigation.navigate("CreateJournalEntry");
            }} />

            <FlatList 
                data={entries} 
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={styles.flatlistContainer}>
                        <TouchableOpacity onPress={() => {
                            setSelectedEntry(item);
                            setModalVisible(true);
                        }}>
                            <Text style={styles.entryTitle}>{item.title}</Text>
                            <Text numberOfLines={1}>{item.content}</Text>
                            <Text style={styles.entryDate}>{item.date}</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.actionButtons}>
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
                    </View>                
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    entryTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    entryDate: {
        fontSize: 10,
        color: "gray",
        marginTop: 4
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8
    },
    editText: {
        color: "blue",
        marginRight: 16
    },
    flatlistContainer: { 
        padding: 6, 
        borderBottomWidth: 1,
        borderBottomColor: 
        "#ccc" 
    },
})

export default JournalEntryListScreen;