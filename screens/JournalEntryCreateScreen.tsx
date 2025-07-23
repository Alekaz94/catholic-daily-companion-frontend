import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { NewJournalEntry } from "../models/JournalEntry";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, View, TextInput, Text, Button, StyleSheet } from "react-native";
import { createEntry } from "../services/JournalEntryService";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import Navbar from "../components/Navbar";

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
        <View style={{flex: 1}}>
            <Navbar />
            <View style={Layout.container}>

            <Text style={Typography.title}>Create Journal Entry</Text>
            <TextInput 
                style={Layout.input}
                placeholder="Title" 
                value={title} 
                onChangeText={(value)  => setTitle(value)} 
            /> 
            <TextInput
                style={Layout.input}
                placeholder="Journal content"
                value={content}
                onChangeText={(value) => setContent(value)}
            />

            <Button title="Create" onPress={handleCreate} />
            <Button title="Cancel" color={"gray"} onPress={() => {navigation.navigate("Journal")}} />
        </View>
        </View>
    );
}

export default JournalEntryCreateScreen;