import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../hooks/useAppTheme"
import { Keyboard, ScrollView, TouchableWithoutFeedback, View, Text, TouchableOpacity } from "react-native";
import Navbar from "../components/Navbar";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import { useAuth } from "../context/AuthContext";
import NavbarLanding from "../components/NavbarLanding";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

type TermsOfServiceNavigationScreen = NativeStackNavigationProp<
  AuthStackParamList,
  'Terms of Service'
>;

const TermsOfServiceScreen = () => {
    const theme = useAppTheme();
    const { isDark } = useTheme();
    const { user } = useAuth();
    const navigation = useNavigation<TermsOfServiceNavigationScreen>();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.auth.navbar}}>
            <View style={{flex: 1}}>
                {user ? <Navbar /> 
                : <TouchableOpacity style={{padding: 10}} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color={theme.auth.text} />
                    </TouchableOpacity>}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView keyboardShouldPersistTaps="handled" style={{backgroundColor: theme.auth.background}}>
                        <View style={Layout.container}>
                            <Text
                                style={[
                                Typography.italic,
                                { fontSize: 22, textAlign: "center", fontWeight: "600", color: theme.auth.text },
                                ]}
                            >
                                Terms of Service
                            </Text>

                            <Text
                                style={[Typography.body, { marginTop: 20, color: theme.auth.text }]}
                            >
                                Last updated: August 30, 2025
                            </Text>

                            <Text
                                style={[Typography.body, { marginTop: 20, color: theme.auth.text }]}
                            >
                                Welcome to Catholic Daily Companion ("the App"). By accessing or using the App, you
                                agree to be bound by these Terms of Service ("Terms"). Please read them carefully
                                before using our services.
                            </Text>

                            <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>
                                1. Use of the App
                            </Text>
                            <Text style={[Typography.body, { color: theme.auth.text }]}>
                                The App is intended for personal, non-commercial use to assist users in their
                                spiritual journey. You agree not to misuse, copy, distribute, or reverse-engineer
                                any part of the App.
                            </Text>

                            <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>
                                2. User Accounts
                            </Text>
                            <Text style={[Typography.body, { color: theme.auth.text }]}>
                                To use certain features, you must create an account. You are responsible for keeping
                                your login credentials secure. We are not responsible for unauthorized access due to
                                your failure to maintain security.
                            </Text>

                            <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>
                                3. Data & Privacy
                            </Text>
                            <Text style={[Typography.body, { color: theme.auth.text }]}>
                                Your personal data is handled in accordance with our{" "}
                            <Text
                                style={{ textDecorationLine: "underline", color: isDark ? "cyan" : "purple" }}
                                onPress={() => navigation.navigate('Privacy Policy')}
                            >
                                Privacy Policy
                            </Text>
                                . You can request deletion or export of your data at any time.
                            </Text>

                            <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>
                                4. Content
                            </Text>
                            <Text style={[Typography.body, { color: theme.auth.text }]}>
                                All texts, prayers, and resources provided within the App are for informational and
                                devotional use. We do not guarantee the accuracy or completeness of external content
                                or links.
                            </Text>

                            <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>
                                5. Termination
                            </Text>
                            <Text style={[Typography.body, { color: theme.auth.text }]}>
                                We reserve the right to suspend or terminate accounts that violate these Terms or
                                misuse the App in any way.
                            </Text>

                            <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>
                                6. Limitation of Liability
                            </Text>
                            <Text style={[Typography.body, { color: theme.auth.text }]}>
                                Catholic Daily Companion and its developers are not liable for any damages arising
                                from the use or inability to use the App.
                            </Text>

                            <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>
                                7. Contact Us
                            </Text>
                            <Text style={[Typography.body, { color: theme.auth.text }]}>
                                For any questions regarding these Terms, please contact:
                            </Text>
                            <Text
                                style={[
                                Typography.body,
                                { fontWeight: "500", marginTop: 10, color: theme.auth.text },
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
                                    fontStyle: "italic",
                                    fontSize: 12,
                                    textAlign: "center",
                                },
                                ]}
                            >
                                These Terms are governed by the laws of Sweden and, where applicable, the laws of the European Union (EU).
                            </Text>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </View>

        </SafeAreaView>
    )
}

export default TermsOfServiceScreen;