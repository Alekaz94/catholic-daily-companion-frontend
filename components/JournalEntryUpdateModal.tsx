import { useEffect, useState } from "react";
import { JournalEntry, UpdateJournalEntry } from "../models/JournalEntry"
import { Modal, TextInput, View, Text, Button, StyleSheet } from "react-native";

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

        onUpdate(entry.id, updatedFields);
        onClose();
    }

    if(!entry) {
        return null;
    }

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.container}>
                <Text style={styles.title}>Edit Entry</Text>
                    <TextInput 
                        placeholder="Enter title..."
                        style={styles.input}
                        value={title}
                        onChangeText={(value) => setTitle(value)}
                    />
                    <TextInput 
                        placeholder="Write your journal entry..."
                        style={styles.multiline}
                        value={content}
                        onChangeText={(value) => setContent(value)}
                    /> 
                    <Button title="Save changes" onPress={onHandleSubmit} /> 
                    <Button title="Cancel" color="gray" onPress={onClose} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 12,
        borderRadius: 6
    },
    multiline: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 12,
        borderRadius: 6,
        height: 200,
        textAlignVertical: "top"
    }
})

export default JournalEntryUpdateModal;