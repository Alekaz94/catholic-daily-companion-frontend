import React from "react";
import { Modal, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Saint } from "../models/Saint";
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import defaultSaint from "../assets/images/default_saint.jpg";
import { buildImageUri } from "../utils/imageUtils";
import SaintFactRow from "./SaintFactRow";
import Divider from "./Divider";
import { useAppTheme } from "../hooks/useAppTheme";

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
    const theme = useAppTheme();

    if(!saint) {
        return null;
    }

    return (
        <Modal visible={visible} animationType='slide'>
            <View style={{ flex: 1, backgroundColor: theme.saint.background, justifyContent: "center"}}>
                <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>       
                    <View style={[Layout.container, {backgroundColor: theme.saint.background, marginHorizontal: 20, borderRadius: 16, padding: 16, elevation: 5}]}>
                        <View style={{ alignItems: 'center'}}>
                            <Text style={[Typography.italic, { color: theme.saint.text, fontSize: 22 }]}>Saint Details</Text>
                        </View>
                        <Divider />
                        <View style={{alignSelf: "center"}}>
                            {saint.imageUrl ? <Image style={Layout.image} source={{ uri: buildImageUri(saint.imageUrl) }} resizeMode="contain" defaultSource={defaultSaint}/> : <Image style={Layout.image} source={defaultSaint} resizeMode="contain"/>}    
                        </View> 
                        <Text style={[Typography.italic, {marginTop: 10, color: theme.saint.text, fontSize: 22, textAlign: "center"}]}>{saint.name}</Text>
                        <View style={{
                            width: "100%", 
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 10,
                            padding: 12,
                            backgroundColor: "#FFFFFF22", 
                            marginTop: 12,
                            }}
                        >                    
                            <Text style={[Typography.italic, {color: theme.saint.text, fontSize: 18, textAlign: "center"}]}>Saint Facts</Text>
                            <Divider />
                            {saint.birthYear && (
                                <SaintFactRow label="Birth" value={`ca ${saint.birthYear}`} />
                            )}
                            {saint.deathYear && (
                                <SaintFactRow label="Death:" value={`ca ${saint.deathYear}`} />
                            )}
                            <SaintFactRow label="Feast day:" value={formatFeastDay(saint.feastDay)} />
                            <SaintFactRow label="Patron of:" value={saint.patronage || "N/A"} multiline />
                            {saint.canonizationYear && (
                                <SaintFactRow label="Canonized:" value={saint.canonizationYear.toString()} />
                            )}
                        </View>
                        <Divider />
                        <Text style={[Typography.body, {lineHeight: 20, textAlign: "justify", color: theme.saint.text}]}>{saint.biography}</Text>
                        <Divider />
                        <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: theme.saint.cardTwo, borderWidth: 1, borderColor: "#aaa"}]}>
                            <Text style={[Layout.buttonText, {alignSelf: "center", color: theme.saint.text}]}>Close</Text>
                        </TouchableOpacity> 
                    </View>
                </ScrollView>
            </View> 
        </Modal>
    );
}

export default SaintDetailModal;