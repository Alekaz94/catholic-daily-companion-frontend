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
                    <ScrollView keyboardShouldPersistTaps="handled" style={{backgroundColor: theme.auth.background}} contentContainerStyle={{ paddingBottom: 40 }}>
                        <View style={[Layout.container, {alignItems: "center"}]}>
                        <Text style={[Typography.italic, { fontSize: 22, textAlign: "center", fontWeight: "600", color: theme.auth.text }]}>
                            Terms of Service
                        </Text>

                        <Text style={[Typography.body, { marginTop: 20, color: theme.auth.text, textAlign: "center"  }]}>
                            Last updated: November 21, 2025
                        </Text>

                        <Text style={[Typography.body, { marginTop: 20, color: theme.auth.text, textAlign: "center"  }]}>
                            By accessing or using Catholic Daily Companion ("the App"), you agree to these Terms of Service.
                        </Text>

                        <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center"  }]}>
                            1. Use of the App
                        </Text>
                        <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center"  }]}>
                            The App is provided for personal spiritual use. You agree not to misuse the App, reverse-engineer it, 
                            disrupt service, or attempt unauthorized access.
                        </Text>

                        <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center"  }]}>
                            2. User Accounts
                        </Text>
                        <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center"  }]}>
                            The App uses Google Authentication. We do not collect or store your Google password.
                            You are responsible for securing your device and login session.
                        </Text>

                        <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center"  }]}>
                            3. Data & Privacy
                        </Text>
                        <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center"  }]}>
                            Your data is handled according to our{" "}
                        <Text
                            style={{ textDecorationLine: "underline", color: isDark ? "cyan" : "purple", textAlign: "center" }}
                            onPress={() => navigation.navigate("Privacy Policy")}
                        >
                            Privacy Policy
                        </Text>
                            .
                        </Text>

                        <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center"  }]}>
                            4. User Content
                        </Text>
                        <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center"  }]}>
                            Journal entries, rosary logs, and other content you create remain your property. 
                            You may delete them at any time.
                        </Text>

                        <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center"  }]}>
                            5. Termination
                        </Text>
                        <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center"  }]}>
                            We may suspend or terminate accounts that violate these Terms or abuse the service.
                        </Text>

                        <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center"  }]}>
                            6. Limitation of Liability
                        </Text>
                        <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center"  }]}>
                            The App is provided “as is.” We do not guarantee uninterrupted service, and we are not
                            responsible for damages resulting from use of the App.
                        </Text>

                        <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center"  }]}>
                            7. Contact Us
                        </Text>
                        <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center"  }]}>
                            For questions about these Terms, contact:
                        </Text>
                        <Text
                        style={[
                            Typography.body,
                            { fontWeight: "500", marginTop: 10, color: theme.auth.text, textAlign: "center"  },
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
                            These Terms are governed by the laws of Sweden and the European Union.
                        </Text>

                        <Text style={[Typography.body, { marginTop: 30, color: theme.auth.smallText, fontStyle: "italic", fontSize: 12, textAlign: "center" }]}>
                            App package: com.alexandros.dailycompanion
                        </Text>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </View>

        </SafeAreaView>
    )
}

export default TermsOfServiceScreen;