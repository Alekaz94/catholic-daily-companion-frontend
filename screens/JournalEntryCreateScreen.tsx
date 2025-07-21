import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { NewJournalEntry } from "../models/JournalEntry";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, View, TextInput, Text, Button, StyleSheet } from "react-native";
import { createEntry } from "../services/JournalEntryService";

type JournalEntryCreateNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "CreateJournalEntry"
>

const JournalEntryCreateScreen = () => {
    const navigation = useNavigation<JournalEntryCreateNavigationProp>();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleCreate = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('Error', 'Both title and content are required.');
            return;
        }

        try {
            const newEntry: NewJournalEntry = {title, content};
            await createEntry(newEntry);
            Alert.alert('Success', 'Journal entry created!');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Error", "Failed to create journal entry!");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Journal Entry</Text>
            <TextInput 
                style={styles.input}
                placeholder="Title" 
                value={title} 
                onChangeText={(value)  => setTitle(value)} 
            /> 
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Journal content"
                value={content}
                onChangeText={(value) => setContent(value)}
            />

            <Button title="Create" onPress={handleCreate} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 12,
        marginBottom: 16
    },
    textArea: {
        height: 120,
        textAlignVertical: "top"
    }
})

export default JournalEntryCreateScreen;