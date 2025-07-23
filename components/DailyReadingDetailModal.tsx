import React from "react";
import { Modal, View, Text, StyleSheet, Button } from "react-native";
import { DailyReading } from "../models/DailyReading";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";

interface Props {
    visible: boolean;
    reading: DailyReading | null;
    onClose: () => void;
}

const DailyReadingDetailModal: React.FC<Props> = ({visible, reading, onClose}) => {
    if(!reading) {
        return null;
    }

    return (
        <Modal visible={visible} animationType='slide'>
            <View style={Layout.container}>
                <Text style={Typography.title}>Today's readings</Text>
                <Text style={Typography.small}>{reading.createdAt}</Text>
                <Text style={[Typography.label, {marginBottom: 5, marginTop: 20, alignSelf: "center"}]}>First reading </Text>
                <Text style={Typography.body}>{reading.firstReading}</Text>
                <Text style={[Typography.label, {marginBottom: 5, marginTop: 20, alignSelf: "center"}]}>Second reading </Text>
                <Text style={Typography.body}>{reading.secondReading}</Text>
                <Text style={[Typography.label, {marginBottom: 5, marginTop: 20, alignSelf: "center"}]}>Psalm </Text>
                <Text style={Typography.body}>{reading.psalm}</Text>
                <Text style={[Typography.label, {marginBottom: 5, marginTop: 20, alignSelf: "center"}]}>Gospel reading </Text>
                <Text style={[Typography.body, {marginBottom: 20}]}>{reading.gospel}</Text>
            
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
    modalReadings: {
        marginBottom: 16,
        padding: 10
    }
})

export default DailyReadingDetailModal;