import { View, Text, TouchableOpacity, Image } from "react-native";
import Navbar from "../components/Navbar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Layout } from "../styles/Layout";
import { useTypography } from "../styles/Typography";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Divider from "../components/Divider";
import { useAppTheme } from "../hooks/useAppTheme";
import AdBanner from "../components/AdBanner";

type PrayerNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Prayer'
>;

const PrayerScreen = () => {
    const navigation = useNavigation<PrayerNavigationProp>();
    const theme = useAppTheme();
    const Typography = useTypography();

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.prayer.primary}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: theme.prayer.background}]}>
                <View style={[Layout.container, {backgroundColor: theme.prayer.background, justifyContent: "space-evenly", paddingVertical: 20}]}>
                <TouchableOpacity onPress={() => navigation.navigate("Rosary")}>
                    <LinearGradient
                        colors={[theme.prayer.cardOne, theme.prayer.cardTwo]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[Layout.card, {
                        borderRadius: 12,
                        borderColor: theme.prayer.background,
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
                        <MaterialCommunityIcons name="cross-outline" size={50} color={theme.prayer.text} />
                        <Text style={[Typography.body, { marginTop: 10, alignSelf: "center", color: theme.prayer.text}]}>Pray the rosary</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={() => navigation.navigate("PrayerList")}>
                    <LinearGradient
                        colors={[theme.prayer.cardOne, theme.prayer.cardTwo]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[Layout.card, {
                        borderRadius: 12,
                        height: 200,
                        borderColor: theme.prayer.background,
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
                        <FontAwesome6 name="hands-praying" size={50} color={theme.prayer.text} />
                        <Text style={[Typography.body, { marginTop: 10, alignSelf: "center", color: theme.prayer.text}]}>List of prayers</Text>
                    </LinearGradient>
                </TouchableOpacity>
                </View>
            </View>
            <AdBanner />
        </SafeAreaView>
    );
}

export default PrayerScreen;