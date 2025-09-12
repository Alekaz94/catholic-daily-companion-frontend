import { useEffect, useState } from "react";
import { JournalEntry, UpdateJournalEntry } from "../models/JournalEntry"
import { Modal, TextInput, View, Text, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import { AppTheme } from "../styles/colors";
import React from "react";

interface Props {
    visible: boolean,
    entry: JournalEntry | null;
    onClose: () => void;
    onUpdate: (id: string, updatedEntry: UpdateJournalEntry) => Promise<void>;
}

const JournalEntryUpdateModal: React.FC<Props> = ({visible, entry, onClose, onUpdate}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(entry) {
            setTitle(entry.title)
            setContent(entry.content)
        }
    }, [entry])

    const onHandleSubmit = async () => {
        if(!entry) {
            return;
        }

        try {
            setIsLoading(true);
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

            await onUpdate(entry.id, updatedFields);
            alert("Update successfull!");
            onClose();
        } catch (error) {
            alert("Update failed. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    if(!entry) {
        return null;
    }

    return (
        <Modal visible={visible} animationType="slide">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={[Layout.container, {backgroundColor: AppTheme.journal.background}]}>
                    <Text style={[Typography.title, {color: AppTheme.journal.text}]}>Edit Entry</Text>
                    <TextInput 
                        editable={!isLoading}
                        placeholder="Enter title..."
                        style={Layout.input}
                        value={title}
                        onChangeText={(value) => setTitle(value)}
                    />
                    <TextInput 
                        editable={!isLoading}
                        placeholder="Write your journal entry..."
                        style={[Layout.input, {height: 200, textAlignVertical: "top"}]}
                        value={content}
                        onChangeText={(value) => setContent(value)}
                    /> 
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <TouchableOpacity style={[Layout.button, {width: "40%", alignSelf: "center", backgroundColor: "#B794F4", borderWidth: 1, opacity: isLoading ? 0.7 : 1}]} onPress={onHandleSubmit} >
                            {isLoading ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <Text style={[Layout.buttonText, {color: AppTheme.journal.text}]}>Save changes</Text>
                            )}
                        </TouchableOpacity>
                        
                        <TouchableOpacity disabled={isLoading} style={[Layout.button, {backgroundColor: "gray", width: "40%", alignSelf: "center", borderWidth: 1, opacity: isLoading ? 0.7 : 1}]} onPress={onClose} >
                            <Text style={Layout.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default JournalEntryUpdateModal;