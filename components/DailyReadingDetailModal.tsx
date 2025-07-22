import React from "react";
import { Modal, View, Text, StyleSheet, Button } from "react-native";
import { DailyReading } from "../models/DailyReading";

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
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Today's readings</Text>
                <Text style={styles.modalDate}>{reading.createdAt}</Text>
                <Text style={styles.modalReadings}>First reading: {reading.firstReading}</Text>
                <Text style={styles.modalReadings}>Second reading: {reading.secondReading}</Text>
                <Text style={styles.modalReadings}>Psalm: {reading.psalm}</Text>
                <Text style={styles.modalReadings}>Gospel reading: {reading.gospel}</Text>
            
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