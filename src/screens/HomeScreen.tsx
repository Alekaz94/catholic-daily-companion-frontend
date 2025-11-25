import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { AuthStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Saint } from '../models/Saint';
import { getSaintOfTheDay } from '../services/SaintService';
import SaintDetailModal from '../components/SaintDetailModal';
import Navbar from '../components/Navbar';
import { useTypography } from '../styles/Typography';
import { Layout } from '../styles/Layout';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import defaultSaint from "../assets/images/default_saint.jpg";
import { buildImageUri } from '../utils/imageUtils';
import QuoteBanner from '../components/QuoteBanner';
import JournalPromptBanner from '../components/JournalPromptBanner';
import RosaryStatusBanner from '../components/RosaryStatusBanner';
import Divider from '../components/Divider';
import SectionTitle from './SectionTitle';
import PrayerBanner from '../components/PrayerBanner';
import { useAppTheme } from '../hooks/useAppTheme';
import AdBanner from '../components/AdBanner';

type HomeNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Home"
>

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const [saints, setSaints] = useState<Saint[] | null>(null);
  const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingSaint, setLoadingSaint] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const theme = useAppTheme();
  const Typography = useTypography();

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
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSaintOfTheDay();
    setRefreshing(false);
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }  
    >
      <Navbar />
      <Text style={[Typography.title, {textAlign: "center", fontWeight: "600", marginTop: 20, color: theme.auth.text}]}>Welcome {user && user.firstName} {user && user.lastName}</Text>
      <Divider />
      <SectionTitle>🕊️ Daily Inspiration</SectionTitle>
      <QuoteBanner />
      <Divider />
      <SectionTitle>🙏 Praying</SectionTitle>
      <PrayerBanner />
      <Divider />
      <SectionTitle>📿 Today's Rosary</SectionTitle>
      <RosaryStatusBanner />
      <Divider />
      <SectionTitle>📓 Personal Journal</SectionTitle>
      <JournalPromptBanner />
      <Divider />

      <SectionTitle>🌟 Saint of the Day</SectionTitle>
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
          <Text style={[Typography.label, {textAlign: "center", color: theme.saint.text}]}>Feast day info not available for today</Text>
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

      {user?.role === "ADMIN" 
        && (<TouchableOpacity onPress={() => navigation.navigate("AdminPanel")} style={[Layout.button, {backgroundColor: theme.auth.navbar, width: "50%", justifyContent: "center", alignSelf: "center", marginVertical: 10}]}>
          <Text style={[Typography.label, {color: theme.auth.text, textAlign: "center"}]}>Go to Admin Panel</Text>
        </TouchableOpacity>
      )}

      <Divider />

      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 40}}>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate("Privacy Policy")}>
              <Text style={{ color: theme.auth.smallText, textDecorationLine: "underline", fontSize: 12}}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text style={{ color: theme.auth.smallText, padding: 10 }}>  •  </Text>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate("Terms of Service")}>
              <Text style={{ color: theme.auth.smallText, textDecorationLine: "underline", fontSize: 12}}>
                Terms of Service
              </Text>
            </TouchableOpacity>
        </View>
      
      <SaintDetailModal 
        visible={modalVisible}
        saint={selectedSaint}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
    <View style={{ position: "absolute", bottom: 0, width: "100%"}}>
        <AdBanner />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
