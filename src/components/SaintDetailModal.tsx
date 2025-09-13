import React from "react";
import { Modal, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Saint } from "../models/Saint";
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import { AppTheme } from "../styles/colors";
import defaultSaint from "../assets/images/default_saint.jpg";
import { buildImageUri } from "../utils/imageUtils";

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
            <ScrollView>
            <View style={[Layout.container, {backgroundColor: AppTheme.saint.background}]}>       
                <View style={{ alignItems: 'center', marginTop: 10 }}>   
                    {saint.imageUrl ? <Image style={Layout.image} source={{ uri: buildImageUri(saint.imageUrl) }} resizeMode="contain"/> : <Image style={Layout.image} source={defaultSaint} resizeMode="contain"/>}
                </View>
                <Text style={[Typography.title, {marginTop: 10, color: AppTheme.saint.text, alignSelf: "center"}]}>{saint.name}</Text>
                <View style={{
                    width: "100%", 
                    height: 200, 
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                    backgroundColor: "#FFFFFF22", 
                    overflow: "hidden",
                    alignSelf: "flex-start",
                    }}
                >                    
                    <Text style={[Typography.title, {color: AppTheme.saint.text, alignSelf: "center", borderBottomWidth: 1}]}>Saint Facts</Text>
                    {saint.birthYear && (
                        <View style={{flexDirection: "row"}}>
                            <Text style={[Typography.body, {color: AppTheme.saint.text, fontWeight: "800"}]}>Birth: </Text>
                            <Text style={[Typography.body, {color: AppTheme.saint.text}]}>ca {saint.birthYear}</Text>
                        </View>
                    )}
                    {saint.deathYear && (
                        <View style={{flexDirection: "row"}}>
                            <Text style={[Typography.body, {color: AppTheme.saint.text, fontWeight: "800"}]}>Death: </Text>
                            <Text style={[Typography.body, {color: AppTheme.saint.text}]}>ca {saint.deathYear}</Text>
                        </View>
                    )}
                    <View style={{flexDirection: "row"}}>
                        <Text style={[Typography.body, {color: AppTheme.saint.text, fontWeight: "800"}]}>Feast day: </Text>
                        <Text style={[Typography.body, {color: AppTheme.saint.text}]}>{formatFeastDay(saint.feastDay)}</Text>
                    </View>
                    <View style={{flexDirection: "column"}}>
                        <Text style={[Typography.body, {color: AppTheme.saint.text, fontWeight: "800"}]}>Patron of: </Text>
                        <Text style={[Typography.body, {color: AppTheme.saint.text,}]}>{saint.patronage}</Text>
                    </View>
                    {saint.canonizationYear && (
                        <View style={{flexDirection: "row"}}>
                            <Text style={[Typography.body, {color: AppTheme.saint.text, fontWeight: "800"}]}>Canonized: </Text>
                            <Text style={[Typography.body, {color: AppTheme.saint.text}]}>{saint.canonizationYear}</Text>
                        </View>
                    )}
                </View>
                <Text style={[Typography.body, {marginTop: 15, marginBottom: 20, color: AppTheme.saint.text}]}>{saint.biography}</Text>
                
                <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: AppTheme.saint.navbar, borderWidth: 1}]}>
                    <Text style={[Layout.buttonText, {alignSelf: "center", color: AppTheme.saint.text}]}>Close</Text>
                </TouchableOpacity> 
            </View> 
            </ScrollView>
        </Modal>
    );
}

export default SaintDetailModal;