import React from 'react';
import { Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { AuthStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Saint } from '../models/Saint';
import SaintDetailModal from '../components/SaintDetailModal';
import NavbarLanding from '../components/NavbarLanding';
import { useTypography } from '../styles/Typography';
import { Layout } from '../styles/Layout';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { buildImageUri } from '../utils/imageUtils';
import QuoteBanner from '../components/QuoteBanner';
import Divider from '../components/Divider';
import SectionTitle from './SectionTitle';
import FeatureItem from './FeatureItem';
import { useAppTheme } from '../hooks/useAppTheme';

type LandingNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Landing"
>

const LandingScreen = () => {
  const navigation = useNavigation<LandingNavigationProp>();
  const theme = useAppTheme();
  const Typography = useTypography();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.auth.navbar}}>
    <ScrollView 
      style={{backgroundColor: theme.auth.background}}
    >
      <NavbarLanding />
      <Text style={[Typography.title, {textAlign: "center", marginTop: 20, color: theme.auth.text}]}>Welcome to Catholic Daily Companion</Text>
      <Text style={[Typography.title, {textAlign: "center", color: theme.auth.text}]}>Start your spiritual journey today</Text>
      <Divider />
      <SectionTitle>🕊️ Daily Inspiration</SectionTitle>
      <QuoteBanner />
    
    <Divider />
    <View style={{ 
      paddingHorizontal: 24, 
      marginTop: 20,
      paddingVertical: 16,
      marginHorizontal: 16,
      backgroundColor: theme.auth.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#ddd"
    }}>
      <View style={{alignSelf: "center"}}>
        <SectionTitle>Grow Your Faith With</SectionTitle>
      </View>
      <Divider />
      <FeatureItem icon="🌟" text="Saint of the Day" />
      <Divider />
      <FeatureItem icon="🕊️" text="Inspirational Quotes" />
      <Divider />
      <FeatureItem icon="📿" text="Rosary Tracker" />
      <Divider />
      <FeatureItem icon="📓" text="Personal Journal Prompts" />
    </View>
    
    <View style={{alignItems: "center", marginTop: 30, marginBottom: 40}}>
      <TouchableOpacity 
        style={{
          backgroundColor: theme.auth.primary,
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderRadius: 8,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: "#aaa"
        }}
        onPress={() => navigation.navigate("Login")}  
      >
        <Text style={[Typography.label, {color: theme.auth.text}]}>Get Started</Text>
      </TouchableOpacity>
    </View>
    <Divider />
    <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 40 }}>
      <TouchableOpacity onPress={() => navigation.navigate("Privacy Policy")}>
        <Text style={{ color: theme.auth.smallText, textDecorationLine: "underline", fontSize: 12 }}>
          Privacy Policy
        </Text>
      </TouchableOpacity>
      <Text style={{ color: theme.auth.smallText }}>  •  </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Terms of Service")}>
        <Text style={{ color: theme.auth.smallText, textDecorationLine: "underline", fontSize: 12 }}>
          Terms of Service
        </Text>
      </TouchableOpacity>
      <Text style={{ color: theme.auth.smallText }}>  •  </Text>
      <TouchableOpacity onPress={() => navigation.navigate("About")}>
        <Text style={{ color: theme.auth.smallText, textDecorationLine: "underline", fontSize: 12 }}>
          About
        </Text>
      </TouchableOpacity>
    </View>
    
    </ScrollView>
    </SafeAreaView>
  );
};

export default LandingScreen;