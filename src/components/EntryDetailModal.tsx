import React from 'react';
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { JournalEntry } from "../models/JournalEntry";
import { useTypography } from '../styles/Typography';
import { Layout } from '../styles/Layout';
import Divider from './Divider';
import { useAppTheme } from '../hooks/useAppTheme';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    visible: boolean;
    entry: JournalEntry | null;
    onClose: () => void;
    onEdit: (entry: JournalEntry) => void;
    onRequestDelete: (entry: JournalEntry) => void;
}

const EntryDetailModal: React.FC<Props> = ({visible, entry, onClose, onEdit, onRequestDelete}) => {
    const theme = useAppTheme();
    const user = useRequireAuth();
    const Typography = useTypography();

    if(!entry || !user) {
        return null;
    }

    return (
        <Modal visible={visible} animationType='slide'>
            <View style={[Layout.container, {backgroundColor: theme.journal.background}]}>
                <Text style={[Typography.title, {color: theme.journal.text, fontWeight: "bold", textAlign: "center", marginTop: 10}]}>{entry.title}</Text>
                
                <Divider />

                <Text style={[Typography.body, {color: theme.journal.text}]}>Created: {entry.date}</Text>
                {entry.updatedAt !== entry.date && 
                    <Text style={[Typography.body, {color: theme.journal.text}]}>Updated: {entry.updatedAt}</Text>
                }
                
                <Divider />

                <Text style={[Typography.italic, {marginTop: 20, marginBottom: 20, color: theme.journal.text}]}>{entry.content}</Text>
            
                <View style={{ marginTop: 20, gap: 8}}>
                    <TouchableOpacity 
                        style={[Layout.button, { flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: theme.journal.primary }]}
                        onPress={() => onEdit(entry)}
                    >
                        <Ionicons name="create-outline" size={20} color={theme.journal.text} />
                        <Text style={[Typography.label, {textAlign: "center", color: theme.journal.text, marginLeft: 10}]}>
                            Edit Entry
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[Layout.button, { flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "red" }]}
                        onPress={() => onRequestDelete(entry)}
                        >
                        <Ionicons name="trash-outline" size={20} color={theme.journal.text} />
                        <Text style={[Typography.label, {textAlign: "center", color: theme.journal.text, marginLeft: 10}]}>
                            Delete Entry
                        </Text>
                    </TouchableOpacity>
                    <Divider />
                </View>
                    <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: theme.journal.button, marginTop: 30}]}>
                        <Text style={[Typography.label, {textAlign: "center", color: theme.journal.text}]}>Close</Text>
                    </TouchableOpacity> 
            </View>
        </Modal>
    );
}

export default EntryDetailModal;