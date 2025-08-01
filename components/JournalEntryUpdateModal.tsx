import { useEffect, useState } from "react";
import { JournalEntry, UpdateJournalEntry } from "../models/JournalEntry"
import { Modal, TextInput, View, Text, TouchableOpacity } from "react-native";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import { AppTheme } from "../styles/colors";
import React from "react";

interface Props {
    visible: boolean,
    entry: JournalEntry | null;
    onClose: () => void;
    onUpdate: (id: string, updatedEntry: UpdateJournalEntry) => void;
}

const JournalEntryUpdateModal: React.FC<Props> = ({visible, entry, onClose, onUpdate}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        if(entry) {
            setTitle(entry.title)
            setContent(entry.content)
        }
    }, [entry])

    const onHandleSubmit = () => {
        if(!entry) {
            return;
        }

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if(!trimmedTitle && !trimmedContent) {
            alert("Both title and content are empty. No changes saved.");
            return;
        }

        const updatedFields: UpdateJournalEntry = {};

        if(trimmedTitle && trimmedTitle !== entry.title) {
            updatedFields.title = trimmedTitle;
        }

        if(trimmedContent && trimmedContent !== entry.content) {
            updatedFields.content = trimmedContent;
        }

        if (Object.keys(updatedFields).length === 0) {
            alert("No changes detected.");
            return;
        }

        alert("Update successful!");
        onUpdate(entry.id, updatedFields);
        onClose();
    }

    if(!entry) {
        return null;
    }

    return (
        <Modal visible={visible} animationType="slide">
            <View style={[Layout.container, {backgroundColor: AppTheme.journal.background}]}>
                <Text style={[Typography.title, {color: AppTheme.journal.text}]}>Edit Entry</Text>
                    <TextInput 
                        placeholder="Enter title..."
                        style={Layout.input}
                        value={title}
                        onChangeText={(value) => setTitle(value)}
                    />
                    <TextInput 
                        placeholder="Write your journal entry..."
                        style={[Layout.input, {height: 200, textAlignVertical: "top"}]}
                        value={content}
                        onChangeText={(value) => setContent(value)}
                    /> 

                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <TouchableOpacity style={[Layout.button, {width: "40%", alignSelf: "center", backgroundColor: "#B794F4"}]} onPress={onHandleSubmit} >
                <Text style={[Layout.buttonText, {color: AppTheme.journal.text}]}>Save changes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[Layout.button, {backgroundColor: "gray", width: "40%", alignSelf: "center"}]} onPress={onClose} 
            >
                <Text style={Layout.buttonText}>Cancel</Text>
            </TouchableOpacity>
            </View>
            </View>
        </Modal>
    );
}

export default JournalEntryUpdateModal;