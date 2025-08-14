import { View, Text, TouchableOpacity, Image } from "react-native";
import Navbar from "../components/Navbar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { LinearGradient } from "expo-linear-gradient";
import { AppTheme } from "../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import { Ionicons } from '@expo/vector-icons';

type PrayerNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Prayer'
>;

const PrayerScreen = () => {
    const navigation = useNavigation<PrayerNavigationProp>();

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#B794F4"}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: AppTheme.journal.background}]}>
                <View style={[Layout.container, {backgroundColor: AppTheme.journal.background, justifyContent: "space-evenly"}]}>
                <TouchableOpacity onPress={() => navigation.navigate("Rosary")}>
                    <LinearGradient
                        colors={['#B794F4', '#F5F3FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[Layout.card, {
                        borderRadius: 12,
                        borderColor: AppTheme.journal.background,
                        padding: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 6,
                        shadowOpacity: 0.1,
                        elevation: 3, 
                        }]}
                    >
                        <Ionicons name="man-outline" size={50} color="#1A1A1A" style={{alignSelf: "center"}}/>                    
                        <Text style={[Typography.body, {fontSize: 20, alignSelf: "center", color: AppTheme.journal.text}]}>Pray the rosary</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("PrayerList")}>
                    <LinearGradient
                        colors={['#B794F4', '#F5F3FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[Layout.card, {
                        borderRadius: 12,
                        borderColor: AppTheme.journal.background,
                        padding: 16,
                        marginVertical: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 6,
                        shadowOpacity: 0.1,
                        elevation: 3, 
                        }]}
                    >
                        <Ionicons name="man-outline" size={50} color="#1A1A1A" style={{alignSelf: "center"}}/>
                        <Text style={[Typography.body, {fontSize: 20, alignSelf: "center", color: AppTheme.journal.text}]}>List of prayers</Text>
                    </LinearGradient>
                </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default PrayerScreen;