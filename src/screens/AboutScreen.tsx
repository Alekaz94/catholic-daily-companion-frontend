import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../hooks/useAppTheme";
import Navbar from "../components/Navbar";
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import { useTheme } from "../context/ThemeContext";
import cdc_transparent_black from "../assets/images/cdc_transparent_black.png"
import cdc_transparent from "../assets/images/cdc_transparent.png"
import { useAuth } from "../context/AuthContext";
import NavbarLanding from "../components/NavbarLanding";
import { Ionicons } from "@expo/vector-icons";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type AboutNavigationScreen = NativeStackNavigationProp<
  AuthStackParamList,
  'Terms of Service'
>;

const AboutScreen = () => {
    const theme = useAppTheme();
    const {isDark} = useTheme();
    const { user } = useAuth();
    const navigation = useNavigation<AboutNavigationScreen>();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.auth.navbar }}>
            {user ? <Navbar /> 
                : <TouchableOpacity style={{padding: 10}} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color={theme.auth.text} />
                </TouchableOpacity>}            
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: theme.auth.background }}
            >
                <View style={[Layout.container, { alignItems: "center" }]}>
                    <Image source={isDark ? cdc_transparent : cdc_transparent_black} style={{ width: 200, height: 200, borderRadius: 20, marginTop: 20 }} />
                    <Text
                        style={[
                        Typography.title,
                        { marginTop: 15, fontFamily: "Playfair-Italic", color: theme.auth.text },
                        ]}
                    >
                        Catholic Daily Companion
                    </Text>
                    <Text
                        style={[
                        Typography.body,
                        { marginTop: 10, color: theme.auth.smallText, textAlign: "center" },
                        ]}
                    >
                        Version 1.0.0
                    </Text>

                    <Text style={[Typography.body, { marginTop: 30, color: theme.auth.text, textAlign: "center" }]}>
                        Catholic Daily Companion helps you grow closer to God with daily inspiration,
                        saint stories, journal prompts, and prayer tracking tools, all designed to
                        strengthen your faith and peace of mind.
                    </Text>

                    <Text style={[Typography.label, { marginTop: 30, color: theme.auth.text }]}>
                        Developed by:
                    </Text>
                    <Text
                        style={[
                        Typography.body,
                        { marginTop: 5, fontWeight: "500", color: theme.auth.text },
                        ]}
                    >
                        Alexandros Kazalis
                    </Text>
                    <Text
                        style={[
                        Typography.body,
                        { color: theme.auth.smallText, marginTop: 5 },
                        ]}
                    >
                        alexandros.kazalis@gmail.com
                    </Text>

                    <Text
                        style={[
                        Typography.body,
                        {
                            marginTop: 30,
                            color: theme.auth.smallText,
                            textAlign: "center",
                            fontStyle: "italic",
                            fontSize: 12,
                        },
                        ]}
                    >
                        Made with ❤️ and faith in Christ.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default AboutScreen;