import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../hooks/useAppTheme";
import Navbar from "../components/Navbar";
import { useTypography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import { useTheme } from "../context/ThemeContext";
import cdc_transparent_black from "../assets/images/cdc_transparent_black.png"
import cdc_transparent from "../assets/images/cdc_transparent.png"
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Divider from "../components/Divider";

type AboutNavigationScreen = NativeStackNavigationProp<
  AuthStackParamList,
  'Terms of Service'
>;

const AboutScreen = () => {
    const theme = useAppTheme();
    const {isDark} = useTheme();
    const { user } = useAuth();
    const navigation = useNavigation<AboutNavigationScreen>();
    const Typography = useTypography();

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
                    <Image source={isDark ? cdc_transparent : cdc_transparent_black} style={{ width: 250, height: 250, borderRadius: 20, marginTop: -70}} />
                    <Text
                        style={[
                        Typography.body,
                        { marginTop: -70, marginBottom: 10, color: theme.auth.smallText, textAlign: "center" },
                        ]}
                    >
                        Version 1.0.0
                    </Text>

                    <Text style={[Typography.title, { marginTop: 10, color: theme.auth.text }]}>
                        About the App
                    </Text>
                    <Text style={[Typography.body, { marginTop: 10, color: theme.auth.text}]}>
                        Catholic Daily Companion is designed to help you grow closer to God with daily inspiration,
                        saint stories, journal prompts, and prayer tracking tools—designed to strengthen
                        your faith, peace and spiritual consistency.
                    </Text>
                    <Divider />
                    <Text style={[Typography.title, { marginTop: 10, color: theme.auth.text }]}>
                        About the Developer
                    </Text>
                    <Text
                        style={[
                        Typography.body,
                        { marginTop: 10, color: theme.auth.text},
                        ]}
                    >
                        My name is <Text style={{ fontWeight: "600" }}>Alexandros Kazalis</Text>, a convert to Catholicism, and father of two.  
                        This app was created as a small way to help fellow Catholics deepen their 
                        relationship with Christ through daily prayer, reflection, and simplicity.  
                        My hope is that it brings peace, encouragement, and a steady reminder of God’s presence.
                    </Text>
                    <Divider />
                    <Text
                        style={[
                        Typography.title,
                        { marginTop: 10, color: theme.auth.text },
                        ]}
                    >
                        Contact
                    </Text>

                    <Text
                        style={[
                        Typography.body,
                        { marginTop: 10, color: theme.auth.text},
                        ]}
                    >
                        alexandros.kazalis@gmail.com
                    </Text>

                    <Text
                        style={[
                        Typography.body,
                        {
                            marginTop: 20,
                            color: theme.auth.smallText,
                            textAlign: "center",
                        },
                        ]}
                    >
                        Made with love, prayer, and faith in Christ.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default AboutScreen;