import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from "react-native";
import { JournalEntry } from "../models/JournalEntry";
import { Typography } from '../styles/Typography';
import { Layout } from '../styles/Layout';

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
            <View style={Layout.container}>
                <Text style={Typography.title}>{entry.title}</Text>
                <Text style={Typography.small}>{entry.date}</Text>
                <Text style={[Typography.body, {marginTop: 20, marginBottom: 20}]}>{entry.content}</Text>

                <Button title="Close" onPress={onClose} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1, 
        padding: 20
    },
    modalTitle: {
        fontSize: 20, 
        fontWeight: "bold"
    },
    modalDate: {
        marginVertical: 10, 
        fontSize: 10
    },
    modalContent: {
        marginBottom: 16,
        padding: 10
    }
})

export default EntryDetailModal;