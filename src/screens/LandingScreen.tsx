import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { AuthStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Saint } from '../models/Saint';
import { getSaintOfTheDay } from '../services/SaintService';
import SaintDetailModal from '../components/SaintDetailModal';
import NavbarLanding from '../components/NavbarLanding';
import { Typography } from '../styles/Typography';
import { Layout } from '../styles/Layout';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import defaultSaint from "../assets/images/default_saint.jpg";
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
  const [saints, setSaints] = useState<Saint[] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
  const [loadingSaint, setLoadingSaint] = useState(false);
  const theme = useAppTheme();

  const formatSaintNames = (saints: Saint[]) => {
    if (saints.length === 1) {
      return saints[0].name;
    } else if (saints.length === 2) {
      return saints.map(s => s.name).join(" and ");
    } else {
      const lastSaint = saints[saints.length - 1].name;
      const otherSaints = saints.slice(0, saints.length - 1).map(s => s.name).join(", ");
      return `${otherSaints}, and ${lastSaint}`;
    }
  }

  const fetchSaintOfTheDay = async () => {
    setLoadingSaint(true)
    const todaysSaint = await getSaintOfTheDay();
    if(!todaysSaint) {
      setLoadingSaint(false);
      return;
    }
    setSaints(todaysSaint);
    setLoadingSaint(false);
  }

  useEffect(() => {
    fetchSaintOfTheDay();
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.auth.navbar}}>
    <ScrollView 
      style={{backgroundColor: theme.auth.background}}
    >
      <NavbarLanding />
      <Text style={[Typography.title, {textAlign: "center", marginTop: 20, fontFamily: "Playfair-Italic", color: theme.auth.text}]}>Welcome to Catholic Daily Companion</Text>
      <Text style={[Typography.title, {textAlign: "center", fontFamily: "Playfair-Italic", color: theme.auth.text}]}>Start your spiritual journey today</Text>
      <Divider />
      <SectionTitle>🕊️ Daily Inspiration</SectionTitle>
      <QuoteBanner />
      <Divider />
      {loadingSaint ? (
        <View style={[Layout.container, {
          padding: 16,
          marginVertical: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.saint.background,
          borderRadius: 12,
          marginHorizontal: 16,
          }]}
        >
          <ActivityIndicator size="small" color={theme.saint.text} />
          <Text style={[Typography.label, { marginTop: 8, textAlign: "center", fontSize: 14, color: theme.saint.text }]}>
            Loading saint of the day...
          </Text>
        </View>
        ) : !saints || saints.length === 0 ? (
        <View style={{
            borderRadius: 12,
            padding: 16,
            marginVertical: 12,
            marginHorizontal:16,
            borderWidth: 1,
            borderColor: "#ddd",
            backgroundColor: theme.saint.background 
          }}
        >
          <Text style={[Typography.label, {textAlign: "center", color: theme.saint.text}]}>No feast day today.</Text>
        </View>
      ) : (
            <>
              {!loadingSaint && saints && saints.length > 0 && (
                <Text style={[Typography.label, {marginVertical: 10, padding: 5, textAlign: "center", color: theme.saint.text}]}>
                  Today is the feast day of {formatSaintNames(saints)}
                </Text>
              )}
          
              {saints.map((saint: Saint) => (
                <View key={saint.id} style={[Layout.container, {backgroundColor: theme.auth.background, marginBottom: 16}]}>
                  <LinearGradient 
                      colors={[theme.saint.cardOne, theme.saint.cardTwo]}
                      start={{x: 0, y: 0.5}}
                      end={{x: 1, y: 0.5}}
                      style={[Layout.card, {borderRadius: 12}]}
                  >
                    <TouchableOpacity 
                      onPress={() => {
                        setModalVisible(true);
                        setSelectedSaint(saint)
                      }}
                      style={{alignItems: "center"}}
                    >
                      {saint.imageUrl 
                        ? <Image style={Layout.image} source={{ uri: buildImageUri(saint.imageUrl) }} defaultSource={defaultSaint}/> 
                        : <Image style={Layout.image} source={defaultSaint}/> 
                      }
                      <Text style={[Typography.label, { marginTop: 10, color: theme.saint.text }]}>{saint.name}</Text>
                    </TouchableOpacity> 
                  </LinearGradient>
                </View>
              ))}
            </>
      )}
    
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
        <Text style={{color: theme.auth.text, fontSize: 16}}>Get Started</Text>
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
    
    <SaintDetailModal 
      visible={modalVisible}
      saint={selectedSaint}
      onClose={() => setModalVisible(false)}
    />
    </ScrollView>
    </SafeAreaView>
  );
};

export default LandingScreen;