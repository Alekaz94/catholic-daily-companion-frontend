import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { NewJournalEntry } from "../models/JournalEntry";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, View, TextInput, Text, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import { createEntry } from "../services/JournalEntryService";
import { Layout } from "../styles/Layout";
import { useTypography } from "../styles/Typography";
import Navbar from "../components/Navbar";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Divider from "../components/Divider";
import { useAppTheme } from "../hooks/useAppTheme";
import { useRequireAuth } from "../hooks/useRequireAuth";

type JournalEntryCreateNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "CreateJournalEntry"
>

const JournalEntryCreateScreen = () => {
    const navigation = useNavigation<JournalEntryCreateNavigationProp>();
    const user = useRequireAuth();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const theme = useAppTheme();
    const Typography = useTypography();

    if(!user) {
        return null;
    }
    
    const handleCreate = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('Error', 'Both title and content are required.');
            return;
        }

        try {
            setIsLoading(true);
            const newEntry: NewJournalEntry = {title, content};
            await createEntry(newEntry);
            Alert.alert(`Created journal entry ${title} succesfully!`);
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Error", "Failed to create journal entry!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.journal.primary}}>
            <Navbar />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={[Layout.container, {backgroundColor: theme.journal.background}]}>

                    <Text style={[Typography.title, {color: theme.journal.text, fontSize: 20, textAlign: "center"}]}>Create Journal Entry</Text>
                    <Divider />
                    <TextInput 
                        style={Layout.input}
                        placeholder="Title" 
                        value={title} 
                        onChangeText={(value)  => setTitle(value)} 
                        editable={!isLoading}
                        placeholderTextColor={"black"}
                    /> 
                    <TextInput
                        style={[Layout.input, { width: "100%", height: 200, textAlignVertical: "top"}]}
                        placeholder="Journal content"
                        value={content}
                        onChangeText={(value) => setContent(value)}
                        multiline={true}
                        editable={!isLoading}
                        placeholderTextColor={"black"}
                    />
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <TouchableOpacity 
                            style={[Layout.button, {backgroundColor: "gray", width: "40%", alignSelf: "center", borderWidth: 1}]} 
                            onPress={() => {navigation.navigate("Journal")}} 
                            disabled={isLoading}
                        >
                            <Text style={[Layout.buttonText, {color: theme.journal.text}]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[Layout.button, {width: "40%", alignSelf: "center", backgroundColor: theme.journal.cardOne, borderWidth: 1, opacity: isLoading ? 0.7 : 1}]} 
                            onPress={handleCreate} 
                        >
                            {isLoading ? (
                                <ActivityIndicator color={theme.auth.text} />
                            ) : (
                                <Text style={[Layout.buttonText, {color: theme.journal.text}]}>Create</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

export default JournalEntryCreateScreen;