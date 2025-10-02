import React, { useEffect, useState } from "react"
import { Calendar } from 'react-native-calendars';
import { Layout } from "../styles/Layout";
import { ActivityIndicator, Modal, Pressable, TouchableOpacity, View, Text } from "react-native";
import { getRosaryHistoryDates, isRosaryCompletedOn } from "../services/RosaryService";
import { getJournalDates, getJournalEntriesByDate } from "../services/JournalEntryService";
import { useAuth } from "../context/AuthContext";
import { getFeastDayToSaintMap, getSaintByFeastDay } from "../services/SaintService";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Saint } from "../models/Saint";
import { JournalEntry } from "../models/JournalEntry";
import DateDetailModal from "./DateDetailModal";
import { useAppTheme } from "../hooks/useAppTheme";

interface MarkedDates {
    [key: string]: { dots: { key: string; color: string }[] };
}

interface Props {
    visible: boolean;
    onClose: () => void;
}

const formatFeastDayToFeastCode = (date: string): string => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${month}-${day}`;
};

const CalendarModal: React.FC<Props> = ({visible, onClose}) => {
    const { user } = useAuth();
    const theme = useAppTheme();
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSaints, setSelectedSaints] = useState<Saint[] | null>(null);
    const [selectedJournals, setSelectedJournals] = useState<JournalEntry[] | null>(null);
    const [saidRosary, setSaidRosary] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const onDayPress = async (day: any) => {
        if(!user) {
            return;
        }
        console.log("Inside day press")
        const date = day.dateString;
        const feastCode = formatFeastDayToFeastCode(date);

        setSelectedDate(date);
        setSelectedSaints(null);
        setSelectedJournals(null);
        setSaidRosary(false);

        try {      
            const [saints, journal, rosary] = await Promise.all([
                getSaintByFeastDay(feastCode),
                getJournalEntriesByDate(date),
                isRosaryCompletedOn(user?.id, date),
            ]);
      
            if (saints && saints.length > 0) {
                setSelectedSaints(saints);
            }

            if (journal) {
                setSelectedJournals(journal);
            }

            if (rosary) {
                setSaidRosary(true);
            }
          } catch (error) {
            console.error("Error fetching data for selected date:", error);
          } finally {
            setModalVisible(true);
          }
    }

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const loadMarkedDates = async () => {
          try {
            setIsLoading(true);
    
            const [rosaryDates, journalDates, feastDayMap] = await Promise.all([
              getRosaryHistoryDates(user.id),
              getJournalDates(),
              getFeastDayToSaintMap(),
            ]);
    
            const today = new Date();
            const currentYear = today.getFullYear();
    
            const marks: MarkedDates = {};
    
            const addDot = (date: string, key: string, color: string) => {
              if (!marks[date]) {
                marks[date] = { dots: [] };
              }
              marks[date].dots.push({ key, color });
            };
    
            rosaryDates.forEach((d: string) => addDot(d, "rosary", "blue"));
            journalDates.forEach((d: string, index: number) => {
                addDot(d, `journal-${index}`, "purple");
              });
            if (feastDayMap && typeof feastDayMap === "object") {
                Object.entries(feastDayMap).forEach(([feastCode, saintNames]) => {
                    const fullDate = `${currentYear}-${feastCode}`;
                    saintNames.forEach((_, index) => {
                        addDot(fullDate, `saint-${feastCode}-${index}`, "gold");
                    })
                });
            } else {
                console.warn("Saints data is not an object", feastDayMap);
            }

            setMarkedDates(marks);
          } catch (error) {
            console.error("Error loading calendar data:", error);
          } finally {
            setIsLoading(false);
          }
        };

        loadMarkedDates();
    }, [user?.id]);

    return (
        <View style={Layout.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color={theme.auth.text} />
            ) : (
                <Modal 
                    visible={visible}
                    transparent
                    animationType="slide"
                    onRequestClose={onClose}
                >
                    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }}>
                        <Pressable
                            onPress={() => {}}
                            style={{
                            backgroundColor: "white",
                            margin: 20,
                            borderRadius: 10,
                            overflow: "hidden",
                            padding: 10,
                            elevation: 5,
                            }}
                        >
                            <Calendar
                                markingType="multi-dot"
                                markedDates={markedDates}
                                onDayPress={onDayPress}
                            />
                        </Pressable>

                        <TouchableOpacity onPress={onClose} style={{ marginTop: 20, borderRadius:10, borderWidth: 1, width: "50%", alignSelf: "center", backgroundColor: theme.auth.background, padding:6, borderColor: theme.auth.text }}>
                            <Text style={{ color: theme.auth.text, textAlign: 'center' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}

            <DateDetailModal
                visible={modalVisible}
                date={selectedDate}
                saints={selectedSaints}
                journals={selectedJournals}
                rosary={saidRosary}
                onClose={() => setModalVisible(false)}
            />
        </View>
    )
}

export default CalendarModal;