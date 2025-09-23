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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Divider from "../components/Divider";

type PrayerNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Prayer'
>;

const PrayerScreen = () => {
    const navigation = useNavigation<PrayerNavigationProp>();

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#ADD8E6"}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: AppTheme.prayer.background}]}>
                <View style={[Layout.container, {backgroundColor: AppTheme.prayer.background, justifyContent: "space-evenly", paddingVertical: 20}]}>
                <TouchableOpacity onPress={() => navigation.navigate("Rosary")}>
                    <LinearGradient
                        colors={['#ADD8E6', '#FFFFFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[Layout.card, {
                        borderRadius: 12,
                        borderColor: AppTheme.prayer.background,
                        padding: 16,
                        height: 200,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 6,
                        shadowOpacity: 0.1,
                        elevation: 3, 
                        alignItems: "center",
                        justifyContent: "center"
                        }]}
                    >
                        <MaterialCommunityIcons name="cross-outline" size={50} color="black" />
                        <Text style={[Typography.body, {fontSize: 20, marginTop: 10, alignSelf: "center", color: AppTheme.prayer.text}]}>Pray the rosary</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={() => navigation.navigate("PrayerList")}>
                    <LinearGradient
                        colors={['#ADD8E6', '#FFFFFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[Layout.card, {
                        borderRadius: 12,
                        height: 200,
                        borderColor: AppTheme.prayer.background,
                        padding: 16,
                        marginVertical: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 6,
                        shadowOpacity: 0.1,
                        elevation: 3, 
                        alignItems: "center",
                        justifyContent: "center"
                        }]}
                    >
                        <FontAwesome6 name="hands-praying" size={50} color="black" />
                        <Text style={[Typography.body, {fontSize: 20, marginTop: 10, alignSelf: "center", color: AppTheme.prayer.text}]}>List of prayers</Text>
                    </LinearGradient>
                </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default PrayerScreen;