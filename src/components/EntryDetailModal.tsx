import React from 'react';
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { JournalEntry } from "../models/JournalEntry";
import { Typography } from '../styles/Typography';
import { Layout } from '../styles/Layout';
import Divider from './Divider';
import { useAppTheme } from '../hooks/useAppTheme';

interface Props {
    visible: boolean;
    entry: JournalEntry | null;
    onClose: () => void;
}

const EntryDetailModal: React.FC<Props> = ({visible, entry, onClose}) => {
    const theme = useAppTheme();

    if(!entry) {
        return null;
    }

    return (
        <Modal visible={visible} animationType='slide'>
            <View style={[Layout.container, {backgroundColor: theme.journal.background}]}>
                <Text style={[Typography.title, {color: theme.journal.text, fontWeight: "bold", textAlign: "center", marginTop: 10, fontSize: 22}]}>{entry.title}</Text>
                <Divider />
                <Text style={[Typography.body, {color: theme.journal.text, fontSize: 18}]}>Created: {entry.date}</Text>
                {entry.updatedAt !== entry.date && 
                    <Text style={[Typography.body, {color: theme.journal.text, fontSize: 18}]}>Updated: {entry.updatedAt}</Text>
                }
                <Divider />
                <Text style={[Typography.italic, {marginTop: 20, marginBottom: 20, color: theme.journal.text, fontSize: 18}]}>{entry.content}</Text>

                <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: theme.journal.button}]}>
                    <Text style={[Layout.buttonText, {alignSelf: "center", color: theme.journal.text}]}>Close</Text>
                </TouchableOpacity> 
            </View>
        </Modal>
    );
}

export default EntryDetailModal;