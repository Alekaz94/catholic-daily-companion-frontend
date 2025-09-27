import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import { Saint } from "../models/Saint";
import { JournalEntry } from "../models/JournalEntry";
import { useState } from "react";
import SaintDetailModal from "./SaintDetailModal";
import EntryDetailModal from "./EntryDetailModal";
import { useAppTheme } from "../hooks/useAppTheme";

interface Props {
    visible: boolean;
    date: string | null;
    saints: Saint[] | null;
    journals: JournalEntry[] | null;
    rosary: boolean;
    onClose: () => void;
  }

  const DateDetailModal = ({ visible, date, saints, journals, rosary, onClose }: Props) => {
    const [saintModalVisible, setSaintModalVisible] = useState(false);
    const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
    const [journalModalVisible, setJournalModalVisible] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
    const theme = useAppTheme();
    
    if(!date) {
        return null;
    }

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={[Layout.container, { backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" }]}>
                <View style={{ backgroundColor: theme.auth.background, padding: 20, borderRadius: 10, width: "90%" }}>
                    <Text style={[Typography.title, { textAlign: "center", color: theme.auth.text }]}>
                        Details for {date}
                    </Text>

                    {saints && saints.length > 0 && (
                        <View>
                            {saints.map((saint) => (
                                <TouchableOpacity
                                    key={saint.id}
                                    style={[Layout.card, { backgroundColor: theme.saint.background, borderColor: "#aaa", marginBottom: 6, borderWidth: 1, borderRadius: 14}]}
                                    onPress={() => {
                                        setSaintModalVisible(true);
                                        setSelectedSaint(saint)
                                    }}
                                >
                                    <Text style={[Typography.body, {textAlign: "center", color: theme.saint.text }]}>
                                        Feast of {saint.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {journals && journals.length > 0 && (
                        <View>
                            {journals.map((journal) => (
                                <TouchableOpacity 
                                    key={journal.id}
                                    style={[Layout.card, {backgroundColor: theme.journal.cardOne, borderColor: "#aaa", marginBottom: 6, borderWidth: 1, borderRadius: 14}]}
                                    onPress={() => {
                                        setJournalModalVisible(true);
                                        setSelectedJournal(journal);
                                    }}
                                >
                                    <Text style={[Typography.body, {borderRadius: 14, textAlign: "center", color: theme.journal.text}]}>Journal: {journal.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {rosary && (
                        <View style={[Layout.card, {backgroundColor: theme.prayer.background, marginBottom: 6, borderColor: "#aaa", borderWidth: 1, borderRadius: 14}]}>
                            <Text style={[Typography.body, {borderRadius: 14, textAlign: "center", color: theme.prayer.text}]}>You prayed the Rosary today!</Text>
                        </View>
                    )}

                    {(!saints || saints.length === 0) && 
                        (!journals || journals.length === 0) &&
                            !rosary && (
                                <View style={{ marginVertical: 10 }}>
                                    <Text style={{textAlign: "center", color: theme.auth.smallText, fontStyle: "italic"}}>
                                        "A peaceful day — nothing noted."
                                    </Text>
                                </View>
                    )}

                    <TouchableOpacity 
                        style={[
                            Layout.button, {
                                backgroundColor: theme.auth.background, 
                                borderRadius: 14, 
                                justifyContent: "center", 
                                borderWidth: 1, 
                                width: "50%",
                                alignSelf: "center",
                                marginTop: 20
                            }
                        ]}
                        onPress={onClose}
                    >
                        <Text style={[Layout.buttonText, {color: theme.auth.text, textAlign: "center"}]}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>

        {selectedSaint && (
            <SaintDetailModal
                visible={saintModalVisible}
                saint={selectedSaint}
                onClose={() => {
                    setSaintModalVisible(false)
                    setSelectedSaint(null)
                }}
            />
        )}
        {selectedJournal && (
            <EntryDetailModal 
                visible={journalModalVisible}
                entry={selectedJournal}
                onClose={() => {
                    setJournalModalVisible(false)
                    setSelectedJournal(null)
                }}
            />
        )}
        </Modal>
    )
}

export default DateDetailModal;