import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { NewJournalEntry } from "../models/JournalEntry";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, View, TextInput, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
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
                style={[Layout.input, {width: "100%", height: 200, textAlignVertical: "top"}]}
                placeholder="Journal content"
                value={content}
                onChangeText={(value) => setContent(value)}
                multiline={true}
            />

            <TouchableOpacity style={[Layout.button, {marginBottom: 5}]} onPress={handleCreate} 
            >
                <Text style={Layout.buttonText}>Create</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[Layout.button, {backgroundColor: "gray"}]} onPress={() => {navigation.navigate("Journal")}} 
            >
                <Text style={Layout.buttonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}

export default JournalEntryCreateScreen;