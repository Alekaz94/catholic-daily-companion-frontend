import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { DailyReading } from "../models/DailyReading";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import { AppTheme } from "../styles/colors";

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
            <View style={[Layout.container, {backgroundColor: AppTheme.reading.background}]}>
                <Text style={[Typography.title, {color: AppTheme.reading.text}]}>Today's readings</Text>
                <Text style={[Typography.small, {color: AppTheme.reading.text}]}>{reading.createdAt}</Text>
                <Text style={[Typography.label, {marginBottom: 5, marginTop: 20, color: AppTheme.reading.text, borderBottomWidth: 1}]}>First reading </Text>
                <Text style={[Typography.body, {color: AppTheme.reading.text}]}>{reading.firstReading}</Text>
                {reading.secondReading ? 
                    <> 
                        <Text style={[Typography.label, {marginBottom: 5, marginTop: 20, borderBottomWidth: 1, color: AppTheme.reading.text}]}>Second reading </Text>
                        <Text style={[Typography.body, {color: AppTheme.reading.text}]}>{reading.secondReading}</Text>
                    </>
                    : 
                    <>
                    </>
                }
                <Text style={[Typography.label, {marginBottom: 5, marginTop: 20, borderBottomWidth: 1, color: AppTheme.reading.text}]}>Psalm </Text>
                <Text style={[Typography.body, {color: AppTheme.reading.text}]}>{reading.psalm}</Text>
                <Text style={[Typography.label, {marginBottom: 5, marginTop: 20, borderBottomWidth: 1, color: AppTheme.reading.text}]}>Gospel reading </Text>
                <Text style={[Typography.body, {marginBottom: 20, color: AppTheme.reading.text}]}>{reading.gospel}</Text>
            
                <TouchableOpacity onPress={onClose} style={[Layout.button, {width: "50%", alignSelf: "center", backgroundColor: "#ADD8E6", borderWidth: 1}]}>
                    <Text style={[Layout.buttonText, {alignSelf: "center", color: AppTheme.reading.text}]}>Close</Text>
                </TouchableOpacity> 
            </View>
        </Modal>
    );
}

export default DailyReadingDetailModal;