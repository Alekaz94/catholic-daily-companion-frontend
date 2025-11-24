import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout } from "../styles/Layout";
import { useTypography } from "../styles/Typography";
import { useState } from "react";
import { prayers, Prayers } from "../data/PrayerList";
import { LinearGradient } from "expo-linear-gradient";
import PrayerDetailModal from "../components/PrayerDetailModal";
import Navbar from "../components/Navbar";
import Divider from "../components/Divider";
import { useAppTheme } from "../hooks/useAppTheme";
import AdBanner from "../components/AdBanner";

const PrayerListScreen = () => {
    const [selectedPrayer, setSelectedPrayer] = useState<Prayers | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const theme = useAppTheme();
    const Typography = useTypography();

    const openModal = (prayer: Prayers) => {
        setSelectedPrayer(prayer);
        setModalVisible(true);
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.prayer.primary}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: theme.prayer.background}]}>
                <Text style={[Typography.title, {textAlign: "center", fontWeight: "600", color: theme.prayer.text}]}>Common Prayers</Text>
                <Divider />
                <FlatList 
                    data={prayers} 
                    keyExtractor={item => item.title}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => openModal(item)}>
                            <LinearGradient
                                colors={[theme.prayer.cardOne, theme.prayer.cardTwo]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[Layout.card, {
                                    borderRadius: 12,
                                    borderColor: theme.prayer.background,
                                    padding: 16,
                                    marginVertical: 8,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 6,
                                    elevation: 3, 
                                }]}
                            >
                                    <Text style={[Typography.body, {color: theme.prayer.text, fontWeight: "bold"}]}>{item.title}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                />
                {selectedPrayer && (
                    <PrayerDetailModal 
                        visible={modalVisible}
                        title={selectedPrayer.title}
                        text={selectedPrayer.prayerText}
                        onClose={() => setModalVisible(false)} 
                    />
                )}
            </View>
            <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
                <AdBanner />
            </View>
        </SafeAreaView>
    );
}

export default PrayerListScreen;