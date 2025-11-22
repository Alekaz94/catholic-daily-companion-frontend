import React from "react";
import { ScrollView, View, Text, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from "../hooks/useAppTheme";
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type PrivacyPolicyNavigationScreen = NativeStackNavigationProp<
  AuthStackParamList,
  'Privacy Policy'
>;

const PrivacyPolicyScreen = () => {
  const theme = useAppTheme();
  const { user } = useAuth();
  const navigation = useNavigation<PrivacyPolicyNavigationScreen>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.auth.navbar }}>
      <View style={{ flex: 1 }}>
        {user 
            ? <Navbar /> 
            : <TouchableOpacity style={{padding: 10}} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color={theme.auth.text} />
            </TouchableOpacity>}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: theme.auth.background }}>
            <View style={[Layout.container, {alignItems: 'center'}]}>
                <Text style={[Typography.italic, { fontSize: 22, textAlign: 'center', fontWeight: '600', color: theme.auth.text }]}>
                    Privacy Policy
                </Text>

                <Text style={[Typography.body, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    Last updated: November 21, 2025
                </Text>

                <Text style={[Typography.body, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>
                    Thank you for using <Text style={{ fontWeight: "600" }}>Catholic Daily Companion</Text> ("we", "our", or "us"). 
                    Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
                </Text>

                <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center" }]}>
                    By using the app, you agree to the terms of this Privacy Policy.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>Information We Collect:</Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center" }]}>
                    - Full name{"\n"}
                    - Email address{"\n"}
                    - Google account information (if signing in via Google){"\n"}
                    - IP address (collected by our backend){"\n"}
                    - Journal entries you create{"\n"}
                    - Rosary logs and prayer history{"\n"}
                    - Audit logs for security and debugging
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>What We Do NOT Collect:</Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center" }]}>
                    - We do NOT collect or store passwords for Google sign-ins{"\n"}
                    - We do NOT receive sensitive Google data such as contacts or files
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>How We Use Your Information:</Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center" }]}>
                    - To authenticate you securely through Google{"\n"}
                    - To display your journal entries and rosary history{"\n"}
                    - To maintain your rosary streaks{"\n"}
                    - To improve app performance (e.g., caching saints){"\n"}
                    - To comply with legal obligations
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>Ads & Analytics:</Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center" }]}>
                    We use Google Mobile Ads. We do not share your personal data with advertisers. 
                    Only anonymized usage data may be collected for ad performance.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>Data Security:</Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center" }]}>
                    We use HTTPS, secure token-based Google authentication, and industry-standard protections.
                    Since we do not collect passwords, no password is ever stored by us.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>Your Rights:</Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center" }]}>
                    You may view, update, or delete your data by contacting:
                </Text>
                <Text
                style={[
                    Typography.body,
                    { fontWeight: "500", marginTop: 10, color: theme.auth.text, textAlign: "center" },
                ]}
                >
                    alexandros.kazalis@gmail.com
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>GDPR Rights:</Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center" }]}>
                    EU users retain rights to access, delete, correct, and export their data. Most actions can be performed directly in the app.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>Data Retention:</Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center"  }]}>
                    Your data is stored until you delete your account. Journal entries and rosary logs can be deleted at any time.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center"  }]}>Children’s Privacy:</Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center"  }]}>
                    We do not knowingly collect data from children under 13. Parental supervision is recommended for young users.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: "center"  }]}>Changes to This Policy:</Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: "center"  }]}>
                    We may update this Privacy Policy. Significant changes will be communicated via the app or email.
                </Text>

                <Text style={[Typography.body, { marginTop: 30, color: theme.auth.smallText, fontStyle: "italic", fontSize: 12, textAlign: "center"  }]}>
                    App package: com.alexandros.dailycompanion
                </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;