import React from "react";
import { Modal, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Saint } from "../models/Saint";
import { useTypography } from "../styles/Typography";
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
    const Typography = useTypography();

    if(!saint) {
        return null;
    }

    return (
        <Modal visible={visible} animationType='slide' transparent>
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: "center"}}>
                <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>       
                    <View style={[Layout.container, {backgroundColor: theme.saint.detail, marginHorizontal: 20, borderRadius: 16, padding: 16, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4,}]}>
                        <Text style={[Typography.title, {color: theme.journal.text, textAlign: "center"}]}>{saint.name}</Text>
                        <Divider />
                        <View>
                            {saint.imageUrl ? <Image style={[Layout.image, {alignSelf: "center", width: "100%"}]} source={{ uri: buildImageUri(saint.imageUrl) }} resizeMode="stretch" defaultSource={defaultSaint}/> : <Text style={[Typography.label, {color: theme.saint.text, textAlign: "center"}]}>Image not available</Text>} 
                            {saint.imageAuthor ? (
                                <Text style={{ 
                                        color: theme.auth.smallText, 
                                        fontSize: 12,
                                        marginTop: 5 
                                    }}
                                >
                                    Author: {saint.imageAuthor}
                                </Text>
                            ) : null}

                            {saint.imageSource ? (
                                <Text
                                    style={{
                                        color: theme.auth.smallText,
                                        fontSize: 12,
                                    }}
                                >
                                    Source: {saint.imageSource}
                                </Text>
                            ) : null}

                            {saint.imageLicence ? (
                                <Text style={{ 
                                        color: theme.auth.smallText, 
                                        fontSize: 12, 
                                    }}
                                >
                                    Licence: {saint.imageLicence}
                                </Text>
                            ) : null}
                        </View> 
                        <View style={{
                            width: "100%", 
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 10,
                            padding: 12,
                            backgroundColor: "#FFFFFF22", 
                            marginVertical: 10,
                            }}
                        >                    
                            <Text style={[Typography.body, {color: theme.saint.text, textAlign: "center"}]}>Saint Facts</Text>
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
                        <Text style={[Typography.italic, {lineHeight: 20, textAlign: "justify", color: theme.saint.text, marginVertical: 10}]}>{saint.biography}</Text>
                        <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: theme.saint.button}]}>
                            <Text style={[Typography.label, {alignSelf: "center", color: theme.saint.text}]}>Close</Text>
                        </TouchableOpacity> 
                    </View>
                </ScrollView>
            </View> 
        </Modal>
    );
}

export default SaintDetailModal;