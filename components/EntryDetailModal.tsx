import React from 'react';
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { JournalEntry } from "../models/JournalEntry";
import { Typography } from '../styles/Typography';
import { Layout } from '../styles/Layout';
import { AppTheme } from '../styles/colors';

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
            <View style={[Layout.container, {backgroundColor: AppTheme.journal.background}]}>
                <Text style={[Typography.title, {color: AppTheme.journal.text}]}>{entry.title}</Text>
                <Text style={[Typography.small, {color: AppTheme.journal.text}]}>{entry.date}</Text>
                <Text style={[Typography.body, {marginTop: 20, marginBottom: 20, color: AppTheme.journal.text}]}>{entry.content}</Text>

                <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: "#B794F4"}]}>
                    <Text style={[Layout.buttonText, {alignSelf: "center", color: AppTheme.journal.text}]}>Close</Text>
                </TouchableOpacity> 
            </View>
        </Modal>
    );
}

export default EntryDetailModal;