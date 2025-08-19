import React from "react";
import { Modal, View, Text, Image, TouchableOpacity } from "react-native";
import { Saint, UpdatedSaint } from "../models/Saint";
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import { AppTheme } from "../styles/colors";
import { Ionicons } from '@expo/vector-icons';

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
    return date.toLocaleDateString("en-US", {month: "long", day: "numeric"})
}

const SaintDetailModal: React.FC<Props> = ({visible, saint, onClose}) => {
    if(!saint) {
        return null;
    }

    return (
        <Modal visible={visible} animationType='slide'>
            <View style={[Layout.container, {backgroundColor: AppTheme.saint.background}]}>          
                {saint.imageUrl ? <Image style={[Layout.image, {height: 300}]} source={{ uri: saint.imageUrl }}/> : <Ionicons name="man-outline" size={100} color="#1A1A1A" style={{alignSelf: "center"}}/> }
                <Text style={[Typography.title, {marginTop: 10, color: AppTheme.saint.text, alignSelf: "center"}]}>{saint.name}</Text>
                <View style={{
                    width: "80%", 
                    height: 140, 
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                    backgroundColor: "#FFFFFF22", 
                    overflow: "hidden",
                    alignSelf: "flex-start",
                    }}
                >                    
                    <Text style={[Typography.title, {color: AppTheme.saint.text, fontSize: 16, alignSelf: "center", borderBottomWidth: 1}]}>Saint Facts</Text>
                    <Text style={[Typography.body, {color: AppTheme.saint.text, fontSize: 12}]}>Birth: ca {saint.birthYear}</Text>
                    <Text style={[Typography.body, {color: AppTheme.saint.text, fontSize: 12}]}>Death: ca {saint.deathYear}</Text>
                    <Text style={[Typography.body, {color: AppTheme.saint.text, fontSize: 12}]}>Feast day: {formatFeastDay(saint.feastDay)}</Text>
                    <Text style={[Typography.body, {color: AppTheme.saint.text, fontSize: 12}]}>Patron of {saint.patronage}</Text>
                    <Text style={[Typography.body, {color: AppTheme.saint.text, fontSize: 12}]}>Canonized: year {saint.canonizationYear}</Text>
                </View>
                <Text style={[Typography.body, {marginTop: 15, marginBottom: 20, color: AppTheme.saint.text}]}>{saint.biography}</Text>
                
                <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: AppTheme.saint.navbar, borderWidth: 1}]}>
                    <Text style={[Layout.buttonText, {alignSelf: "center", color: AppTheme.saint.text}]}>Close</Text>
                </TouchableOpacity> 
            </View> 
        </Modal>
    );
}

export default SaintDetailModal;