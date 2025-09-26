import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout } from "../styles/Layout";
import { AppTheme } from "../styles/colors";
import { Typography } from "../styles/Typography";
import { useState } from "react";
import { prayers, Prayers } from "../data/PrayerList";
import { LinearGradient } from "expo-linear-gradient";
import PrayerDetailModal from "../components/PrayerDetailModal";
import Navbar from "../components/Navbar";
import Divider from "../components/Divider";

const PrayerListScreen = () => {
    const [selectedPrayer, setSelectedPrayer] = useState<Prayers | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (prayer: Prayers) => {
        setSelectedPrayer(prayer);
        setModalVisible(true);
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ADD8E6'}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: AppTheme.prayer.background}]}>
                <Text style={[Typography.italic, {textAlign: "center", fontSize: 22, fontWeight: "600"}]}>Common Prayers</Text>
                <Divider />
                <FlatList 
                    data={prayers} 
                    keyExtractor={item => item.title}
                    renderItem={({ item }) => (
                        <LinearGradient
                            colors={['#ADD8E6', '#FFFFFF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[Layout.card, {
                                borderRadius: 12,
                                borderColor: AppTheme.prayer.background,
                                padding: 16,
                                marginVertical: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 6,
                                elevation: 3, 
                            }]}
                        >
                            <TouchableOpacity onPress={() => openModal(item)}>
                                <Text style={[Typography.body, {color: AppTheme.prayer.text, fontSize: 16, fontWeight: "bold"}]}>{item.title}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
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
        </SafeAreaView>
    );
}

export default PrayerListScreen;