import React, { useEffect, useState } from "react";
import { JournalEntry } from "../models/JournalEntry";
import { deleteEntry, getAllEntries } from "../services/JournalEntryService";
import { FlatList, TouchableOpacity, View, Text, StyleSheet, Button } from "react-native";
import EntryDetailModal from "../components/EntryDetailModal";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type JournalEntryListNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "Journal"
>

const JournalEntryListScreen = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation<JournalEntryListNavigationProp>();

    const fetchEntries = async () => {
        const data = await getAllEntries();
        setEntries(data);
    }

    const handleDelete = async (id: string) => {
        await deleteEntry(id);
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
                    <TouchableOpacity onPress={() => {
                        setSelectedEntry(item);
                        setModalVisible(true);
                    }}>
                        <View style={styles.flatlistContainer}>
                            <View style={{flexDirection: "row"}}>
                                <View style={styles.journalCardUpdateAndDelete}>
                                    <Text style={styles.entryTitle}>{item.title}</Text>
                                    <TouchableOpacity onPress={() => {"Navigate to update screen"}}>
                                    <Text style={styles.text}>Update</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                        <Text style={styles.text}>Delete</Text>
                                    </TouchableOpacity>
                                    <Text>{item.date}</Text>
                                </View>
                            </View>
                            <Text numberOfLines={1}>{item.content}</Text>
                        </View>
                    </TouchableOpacity>
                    )}
            />

            <EntryDetailModal 
                visible={modalVisible}
                entry={selectedEntry}
                onClose={() => setModalVisible(false)} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: "#fff" 
    },
    entryTitle: {
        fontSize: 14,
        marginRight: 5,
    },
    flatlistContainer: { 
        padding: 6, 
        borderBottomWidth: 1,
        borderBottomColor: 
        "#ccc" 
    },
    journalCardUpdateAndDelete: { 
        flexDirection: "row", 
        justifyContent: "space-evenly",
        padding: 5,
        backgroundColor: "lightblue",
        marginBottom: 4, 
        marginLeft: 2
    },
    text: { 
        marginRight: 8, 
        color: "#007BFF"
    },
})

export default JournalEntryListScreen;