import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from "react-native";
import { JournalEntry } from "../models/JournalEntry";

interface Props {
    visible: boolean;
    entry: JournalEntry | null;
    onClose: () => void;
}

const EntryDetailModal: React.FC<Props> = ({visible, entry, onClose}) => {
    if(!entry) {
        return null;
    }

    return (
        <Modal visible={visible} animationType='slide'>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>{entry.title}</Text>
                <Text style={styles.modalDate}>{entry.date}</Text>
                <Text>{entry.content}</Text>

                <Button title="Close" onPress={onClose} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {flex: 1, padding: 20},
    modalTitle: {fontSize: 20, fontWeight: "bold"},
    modalDate: {marginVertical: 10, fontSize: 10}
})

export default EntryDetailModal;