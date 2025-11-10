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
            <View style={Layout.container}>
                <Text style={[Typography.italic, { fontSize: 22, textAlign: "center", fontWeight: "600", color: theme.auth.text }]}>
                    Privacy Policy
                </Text>

                <Text style={[Typography.body, { marginTop: 20, color: theme.auth.text }]}>
                    Last updated: August 30, 2025
                </Text>

                <Text style={[Typography.body, { marginTop: 20, color: theme.auth.text }]}>
                    Thank you for using Catholic Daily Companion ("we", "our", or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
                </Text>

                <Text style={[Typography.body, { color: theme.auth.text }]}>
                    By using the app, you agree to the terms of this Privacy Policy.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>Information We Collect:</Text>
                <Text style={[Typography.body, { color: theme.auth.text }]}>
                    - Full name{"\n"}
                    - Email address{"\n"}
                    - Password (stored securely as a hashed value){"\n"}
                    - Google profile data (if signing in via Google){"\n"}
                    - Journal entries you create inside the app
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>How We Use Your Information:</Text>
                <Text style={[Typography.body, { color: theme.auth.text }]}>
                    - To manage your account and personalize your experience{"\n"}
                    - To authenticate users securely{"\n"}
                    - To store your journal entries privately{"\n"}
                    - To comply with any applicable legal obligations
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>Data Security:</Text>
                <Text style={[Typography.body, { color: theme.auth.text }]}>
                    We use industry-standard measures to protect your data, including encrypted password storage and secure HTTPS connections.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>Sharing Your Information:</Text>
                <Text style={[Typography.body, { color: theme.auth.text }]}>
                    We do not sell or share your information, except with trusted third-party services like Firebase Authentication or as required by law.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>Children’s Privacy:</Text>
                <Text style={[Typography.body, { color: theme.auth.text }]}>
                    Catholic Daily Companion is designed to be spiritually enriching for people of all ages. However, to comply with privacy laws, children under the age of 13 should use the app with supervision from a parent or guardian. We do not knowingly collect personal information from children under 13.              
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>Your Rights:</Text>
                <Text style={[Typography.body, { color: theme.auth.text }]}>
                    You may request to view, update, or delete your personal data by contacting us at:
                </Text>
                <Text style={[Typography.body, { fontWeight: "500", marginTop: 10, color: theme.auth.text }]}>
                    alexandros.kazalis@gmail.com
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>
                    GDPR Data Protection Rights:
                </Text>
                <Text style={[Typography.body, { color: theme.auth.text }]}>
                    If you are located in the European Union (EU), you have certain data protection rights under the General Data Protection Regulation (GDPR). These include the right to:
                    {"\n"}• Access the personal data we hold about you
                    {"\n"}• Request correction of inaccurate or incomplete data
                    {"\n"}• Request deletion of your personal data
                    {"\n"}• Request a copy of your personal data (data portability)
                    {"\n"}• Object to or restrict the processing of your data
                    {"\n\n"}
                    You can exercise most of these rights directly in the app:
                    {"\n"}• Update your profile or password from your account profile
                    {"\n"}• Edit or delete your journal entries at any time
                    {"\n"}• Export your data in JSON or ZIP format
                    {"\n"}• Delete your account and all related data permanently
                    {"\n\n"}
                    For any additional requests regarding your data or privacy rights, please contact us at:
                </Text>

                <Text style={[Typography.body, { fontWeight: "500", marginTop: 10, color: theme.auth.text }]}>
                    alexandros.kazalis@gmail.com
                </Text>

                <Text style={[Typography.body, { color: theme.auth.text, marginTop: 10 }]}>
                    We will respond to your request in accordance with applicable data protection laws.
                </Text>

                <Text style={[Typography.label, { marginTop: 20, color: theme.auth.text }]}>Changes to This Policy:</Text>
                <Text style={[Typography.body, { color: theme.auth.text }]}>
                    We may occasionally update this Privacy Policy. If changes are significant, we will notify you via the app or email.
                </Text>

                <Text style={[Typography.body, { marginTop: 30, color: theme.auth.smallText, fontStyle: "italic", fontSize: 12 }]}>
                    This app complies with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
                </Text>

                <Text style={[Typography.body, { marginTop: 30, color: theme.auth.smallText, fontStyle: "italic", fontSize: 12 }]}>
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