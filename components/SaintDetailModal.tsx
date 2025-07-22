import React from "react";
import { Modal, View, StyleSheet, Button, Text, Image } from "react-native";
import { Saint } from "../models/Saint";
import defaultSaintImage from '../assets/images/default_saint.png';

interface Props {
    visible: boolean;
    saint: Saint | null;
    onClose: () => void;
}

function formatFeastDay(feastDayString: string | null) {
    if(!feastDayString) {
        return "No feast day."
    }

    const cleaned = feastDayString.startsWith("--") ? feastDayString.slice(2) : feastDayString;
    let month = 0;
    let day = 0;

    if(cleaned.length === 5) {
        const [mm, dd] = cleaned.split("-");
        month = parseInt(mm, 10);
        day = parseInt(dd, 10);
    } else if (cleaned.length === 10) {
        const [yyyy, mm, dd] = cleaned.split("-");
        month = parseInt(mm, 10);
        day = parseInt(dd, 10);
    } else {
        return feastDayString;
    }

    const date = new Date(2000, month - 1, day);
    return date.toLocaleDateString(undefined, {month: "long", day: "numeric"})
}

const SaintDetailModal: React.FC<Props> = ({visible, saint, onClose}) => {
    if(!saint) {
        return null;
    }

    return (
        <Modal visible={visible} animationType='slide'>
            <View style={styles.modalView}>
            <Image style={styles.modalImage} source={saint.imageUrl ? { uri: saint.imageUrl } : defaultSaintImage} />
            <Text style={styles.modalTitle}>{saint.name}</Text>
            <Text style={styles.modalText}>Patron of {saint.patronage}</Text>
            <Text style={styles.modalDate}>ca {saint.birthYear} - ca {saint.deathYear}</Text>
            <Text style={styles.modalDate}>Feast Day: {formatFeastDay(saint.feastDay)}</Text>
            <Text style={styles.modalDate}>Canonized: {saint.canonizationYear}</Text>
            <Text style={styles.modalContent}>{saint.biography}</Text>
            
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
    modalText: {
        fontSize: 10,
        fontWeight: "light",
        color: "gray"
    },
    modalDate: {
        marginVertical: 10, 
        fontSize: 10
    },
    modalContent: {
        marginBottom: 16,
        padding: 10
    },
    modalImage: { 
        width: 100, 
        height: 100, 
        borderRadius: 50 
    },

})

export default SaintDetailModal;