import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useTypography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import { Saint, SaintListDto } from "../models/Saint";
import { JournalEntry, JournalEntryLite } from "../models/JournalEntry";
import { useState } from "react";
import SaintDetailModal from "./SaintDetailModal";
import EntryDetailModal from "./EntryDetailModal";
import { useAppTheme } from "../hooks/useAppTheme";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { getSpecificSaint } from "../services/SaintService";
import { getSpecificEntry } from "../services/JournalEntryService";

interface Props {
    visible: boolean;
    date: string | null;
    saints: SaintListDto[] | null;
    journals: JournalEntryLite[] | null;
    rosary: boolean;
    onClose: () => void;
  }

  const DateDetailModal = ({ visible, date, saints, journals, rosary, onClose }: Props) => {
    const [saintModalVisible, setSaintModalVisible] = useState(false);
    const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
    const [loadingSaint, setLoadingSaint] = useState(false);

    const [journalModalVisible, setJournalModalVisible] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
    const [loadingJournal, setLoadingJournal] = useState(false);

    const theme = useAppTheme();
    const user = useRequireAuth();
    const Typography = useTypography();

    if(!date || !user) {
        return null;
    }

    const openSaint = async (saintDto: SaintListDto) => {
        setLoadingSaint(true);
        setSelectedSaint(null);
        setSaintModalVisible(true);

        try {
            const fullSaint = await getSpecificSaint(saintDto.id);
            setSelectedSaint(fullSaint);
        } catch (error) {
            console.error("Failed to fetch saint details:", error);
        } finally {
            setLoadingSaint(false);
        }
    }

    const openEntry = async (entryDto: JournalEntryLite) => {
        setLoadingJournal(true);
        setSelectedJournal(null);
        setJournalModalVisible(true);

        try {
            const fullEntry = await getSpecificEntry(entryDto.id);
            setSelectedJournal(fullEntry);
        } catch (error) {
            console.error("Failed to fetch journal details:", error);
        } finally {
            setLoadingJournal(false);
        }
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
                                    style={[Layout.card, { backgroundColor: theme.saint.background, marginBottom: 6, marginTop: 6, borderRadius: 14}]}
                                    onPress={() => openSaint(saint)}
                                >
                                    <Text style={[Typography.body, {borderRadius: 14, textAlign: "center", color: theme.saint.text }]}>
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
                                    style={[Layout.card, {backgroundColor: theme.journal.primary, marginBottom: 6, marginTop: 6, borderRadius: 14}]}
                                    onPress={() => openEntry(journal)}
                                >
                                    <Text style={[Typography.body, {borderRadius: 14, textAlign: "center", color: theme.journal.text}]}>Journal: {journal.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {rosary && (
                        <View style={[Layout.card, {backgroundColor: theme.prayer.primary, marginBottom: 6, marginTop: 6, borderRadius: 14}]}>
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
                                borderColor: "#ccc",
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