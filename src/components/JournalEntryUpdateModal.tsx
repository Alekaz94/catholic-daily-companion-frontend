import { useEffect, useState } from "react";
import { JournalEntry, UpdateJournalEntry } from "../models/JournalEntry"
import { Modal, TextInput, View, Text, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Layout } from "../styles/Layout";
import { useTypography } from "../styles/Typography";
import React from "react";
import Divider from "./Divider";
import { useAppTheme } from "../hooks/useAppTheme";

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
    const theme = useAppTheme();
    const Typography = useTypography();

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
                <View style={[Layout.container, {backgroundColor: theme.journal.background}]}>
                <Text style={[Typography.title, {color: theme.journal.text, fontSize: 20, textAlign: "center"}]}>Edit Journalentry</Text>
                <Divider />
                <TextInput 
                        editable={!isLoading}
                        placeholder="Enter title..."
                        style={[Layout.input, {marginTop: 10}]}
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
                        <TouchableOpacity style={[Layout.button, {width: "40%", alignSelf: "center", backgroundColor: theme.journal.cardOne, borderWidth: 1, borderColor: "#ccc", opacity: isLoading ? 0.7 : 1}]} onPress={onHandleSubmit} >
                            {isLoading ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <Text style={[Layout.buttonText, {color: theme.journal.text}]}>Save changes</Text>
                            )}
                        </TouchableOpacity>
                        
                        <TouchableOpacity disabled={isLoading} style={[Layout.button, {backgroundColor: "gray", width: "40%", alignSelf: "center", opacity: isLoading ? 0.7 : 1}]} onPress={onClose} >
                            <Text style={[Layout.buttonText, {color: theme.journal.text}]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default JournalEntryUpdateModal;