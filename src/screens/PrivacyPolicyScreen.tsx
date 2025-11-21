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

                <Text style={[Typography.body, { marginTop: 20, color: theme.auth.text, textAlign: 'justify' }]}>
                    Thank you for using <Text style={{ fontWeight: '600' }}>Catholic Daily Companion</Text> ("we", "our", or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
                </Text>

                <Text style={[Typography.body, { color: theme.auth.text, textAlign: 'justify' }]}>
                    By using the app, you agree to the terms of this Privacy Policy.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    Information We Collect:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: 'justify' }]}>
                    - Full name{"\n"}
                    - Email address{"\n"}
                    - Password (hashed securely){"\n"}
                    - IP address (collected via backend){"\n"}
                    - Google profile data (if signing in via Google){"\n"}
                    - Journal entries created in the app{"\n"}
                    - Rosary logs, streaks, and dates of prayers{"\n"}
                    - Audit logs of user actions for security and analytics
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    How We Use Your Information:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: 'justify' }]}>
                    - To manage your account and personalize your experience{"\n"}
                    - To authenticate users securely{"\n"}
                    - To store journal entries and rosary history privately{"\n"}
                    - To comply with legal obligations{"\n"}
                    - To display your name, journal entries, rosary streak, and cached saints in the app
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    Ads and Analytics:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: 'justify' }]}>
                    We use Google Mobile Ads for monetization. Your personal data is not shared with advertisers. Only anonymized usage metrics may be collected for ad performance.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    Data Security:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: 'justify' }]}>
                    We use industry-standard security measures to protect your data, including HTTPS, hashed passwords, and secure Firebase services.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    Sharing Your Information:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: 'justify' }]}>
                    We do not sell or share your personal information except with trusted third-party services like Firebase Authentication or when required by law.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    Children’s Privacy:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: 'justify' }]}>
                    The app is suitable for all ages. Children under 13 should use the app with parental supervision. We do not knowingly collect personal information from children under 13.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    Your Rights:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: 'justify' }]}>
                    You may request to view, update, or delete your personal data by contacting us at:
                </Text>
                <Text style={[Typography.body, { fontWeight: '500', marginTop: 10, color: theme.auth.text, textAlign: 'center' }]}>
                    alexandros.kazalis@gmail.com
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    GDPR Data Protection Rights:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: 'justify' }]}>
                    If you are located in the EU, you have rights under GDPR, including access, correction, deletion, export, and objection to processing. Most rights can be exercised directly in the app:
                    {"\n"}- Update profile or password
                    {"\n"}- Edit or delete journal entries
                    {"\n"}- Export data (JSON/ZIP)
                    {"\n"}- Delete account permanently
                </Text>
                <Text style={[Typography.body, { fontWeight: '500', marginTop: 10, color: theme.auth.text, textAlign: 'center' }]}>
                    For additional requests: alexandros.kazalis@gmail.com
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    Data Retention:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: 'justify' }]}>
                    We store your data until you delete your account. You can delete journal entries or rosary history anytime. Cached saints are stored temporarily for app performance.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text, textAlign: 'center' }]}>
                    Changes to This Policy:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text, textAlign: 'justify' }]}>
                    We may update this Privacy Policy. Significant changes will be communicated via the app or email.
                </Text>

                <Text style={[Typography.body, { marginTop: 30, color: theme.auth.smallText, fontStyle: 'italic', fontSize: 12, textAlign: 'center' }]}>
                    This app complies with GDPR and other applicable data protection laws.
                </Text>

                <Text style={[Typography.body, { marginTop: 10, color: theme.auth.smallText, fontStyle: 'italic', fontSize: 12, textAlign: 'center' }]}>
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