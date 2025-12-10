import React from "react";
import { ScrollView, View, Text, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from "../hooks/useAppTheme";
import { useTypography } from "../styles/Typography";
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
  const Typography = useTypography();

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
                <Text style={[Typography.title, { fontSize: 22, textAlign: 'center', fontWeight: '600', color: theme.auth.text }]}>
                    Privacy Policy
                </Text>

                <Text style={[Typography.body, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    Last updated: November 21, 2025
                </Text>

                <Text style={[Typography.body, { marginTop: 20, color: theme.auth.text}]}>
                    Thank you for using <Text style={{ fontWeight: "600" }}>Catholic Daily Companion</Text> ("we", "our", or "us"). 
                    Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
                </Text>

                <Text style={[Typography.body, { marginTop: 20, color: theme.auth.text, fontWeight: "600"}]}>
                    Age Restriction:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text}]}>
                    This app is intended for users 18 years or older. We do not knowingly collect personal information from anyone under 18.
                </Text>

                <Text style={[Typography.title, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>1. Information We Collect</Text>
                <Text style={[Typography.body, { color: theme.auth.text}]}>
                    - Full name and email address – to create your account and allow secure authentication.{"\n"}
                    - Google account information (if signing in via Google) – only your name and email. No passwords are collected.{"\n"}
                    - IP address – automatically collected for security, abuse prevention, and analytics.{"\n"}
                    - Journal entries – to store and display your personal reflections.{"\n"}
                    - Rosary logs – your rosary history, streaks, and completion status.{"\n"}
                    - Feedback emails – viewed only by administrators to respond to user inquiries or improve the app.{"\n"}
                    - Audit logs – for security, debugging, and detecting unauthorized activity.
                </Text>

                <Text style={[Typography.title, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>2. What We Do NOT Collect</Text>
                <Text style={[Typography.body, { color: theme.auth.text}]}>
                    - We do NOT collect or store your Google password.{"\n"}
                    - We do NOT receive sensitive Google data such as contacts or files
                </Text>

                <Text style={[Typography.title, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>3. How We Use Your Information</Text>
                <Text style={[Typography.body, { color: theme.auth.text}]}>
                    - Secure authentication via Google.{"\n"}
                    - Displaying your journal entries and rosary history.{"\n"}
                    - Maintaining rosary streaks and progress.{"\n"}
                    - Responding to feedback and improving app functionality.{"\n"}
                    - Analyzing app performance and usage trends (anonymized).{"\n"}
                    - Complying with legal obligations.
                </Text>

                <Text style={[Typography.title, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>4. Third-Party Services</Text>
                <Text style={[Typography.body, { color: theme.auth.text}]}>
                    - <Text style={{ fontWeight: "600"}}>Google Authentication (OAuth2)</Text> – for secure sign-in. Only your name and email are received.{"\n"}
                    - <Text style={{ fontWeight: "600"}}>Google Mobile Ads (AdMob)</Text> – displays ads. Only anonymized usage and device data may be collected.{"\n"}
                    - <Text style={{ fontWeight: "600"}}>Railway Hosting</Text> – backend and database hosting. Your journal entries, rosary logs, and account records are stored securely.{"\n"}
                    - <Text style={{ fontWeight: "600"}}>PostgreSQL Database</Text> – stores journal entries, rosary data, logs, and other content you create.{"\n"}
                    - <Text style={{ fontWeight: "600"}}>Expo / React Native Services</Text> – may collect anonymized diagnostics (e.g., app crashes, device type).
                </Text>

                <Text style={[Typography.title, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>5. Data Security</Text>
                <Text style={[Typography.body, { color: theme.auth.text}]}>
                    We implement HTTPS, secure token-based authentication, and industry-standard practices to protect your data. Feedback emails are accessible only by app administrators. Sensitive data such as passwords are never stored.
                </Text>

                <Text style={[Typography.title, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>6. Your Rights</Text>
                <Text style={[Typography.body, { color: theme.auth.text}]}>
                    You may update, delete, or request deletion of your data by contacting: alexandros.kazalis@gmail.com. 
                    You can also delete your account directly in the app, which will remove your journal entries, rosary logs, and account information. 
                    Currently, there is no email-based method to view your stored data; however, you can export a copy of your data directly from the app using the “Export JSON” or Export ZIP” buttons in Settings. 
                    Requests for deletion via email will be addressed promptly, typically within 30 days.
                </Text>

                <Text style={[Typography.title, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>7. GDPR Rights</Text>
                <Text style={[Typography.body, { color: theme.auth.text}]}>
                    EU users can access, correct, delete, or export their data. Most actions can be performed directly in the app.
                </Text>

                <Text style={[Typography.title, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>8. Data Retention</Text>
                <Text style={[Typography.body, { color: theme.auth.text}]}>
                    Your data is stored until you delete your account. Journal entries can be deleted at any time.
                </Text>

                <Text style={[Typography.title, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>9. Children’s Privacy</Text>
                <Text style={[Typography.body, { color: theme.auth.text}]}>
                    We do not knowingly collect data from children under 18. Parental supervision is recommended for young users.
                </Text>

                <Text style={[Typography.title, { marginTop: 20, color: theme.auth.text, textAlign: "center" }]}>10. Changes to This Policy</Text>
                <Text style={[Typography.body, { color: theme.auth.text }]}>
                    If this policy changes, users will be notified in the app or via email.
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