import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { AuthStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Saint } from '../models/Saint';
import { getSaintOfTheDay } from '../services/SaintService';
import SaintDetailModal from '../components/SaintDetailModal';
import Navbar from '../components/Navbar';
import { Typography } from '../styles/Typography';
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
import { AppTheme } from '../styles/colors';

type HomeNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Home"
>

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const [saint, setSaint] = useState<Saint | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingSaint, setLoadingSaint] = useState(false);
  const { user } = useAuth();

  const fetchSaintOfTheDay = async () => {
    setLoadingSaint(true)
    const todaysSaint = await getSaintOfTheDay();
    if(!todaysSaint) {
      setLoadingSaint(false);
      return;
    }
    setSaint(todaysSaint);
    setLoadingSaint(false);
  }

  useEffect(() => {
    fetchSaintOfTheDay();
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF3E0"}}>
    <ScrollView style={{backgroundColor: AppTheme.auth.background}}>
      <Navbar />
      <Text style={[Typography.title, {textAlign: "center", marginTop: 20}]}>Welcome back {user && user.firstName}</Text>

      <QuoteBanner />
      <JournalPromptBanner />
      {user?.role === "ADMIN" 
        && (<TouchableOpacity onPress={() => navigation.navigate("AdminPanel")} style={[Layout.button, {backgroundColor: "#FAF3E0", margin: 10, borderWidth: 1}]}>
          <Text style={[Typography.link, {color: "black"}]}>Go to Admin Panel</Text>
        </TouchableOpacity>
      )}

      {loadingSaint ? (
        <View style={[Layout.container, {backgroundColor: "#F0F9FF"}]}>
          <Text style={[Typography.label, { textAlign: 'center' }]}>Loading saint of the day...</Text>
        </View>
      ) : !saint ? (
        <View style={{
            borderRadius: 12,
            padding: 16,
            marginVertical: 12,
            backgroundColor: "#FAF3E0" }}
          >
          <Text style={[Typography.label, {textAlign: "center"}]}>No feast day today.</Text>
        </View>
      ) : (
        (
          <View style={[Layout.container, {backgroundColor: "#F0F9FF"}]}>
            <LinearGradient 
                colors={['#FAF3E0', "#F0F9FF"]}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={[Layout.card, {borderRadius: 12}]}
            >
              <Text style={[Typography.label, {marginBottom: 10, textAlign: "center"}]}>Today is the feast day of {saint?.name}</Text>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{alignItems: "center"}}
              >
                {saint.imageUrl ? <Image style={Layout.image} source={{  uri: buildImageUri(saint.imageUrl)  }}/> : <Image style={Layout.image} source={defaultSaint}/> }
                <Text style={[Typography.label, { marginTop: 10 }]} >{saint.name}</Text>
              </TouchableOpacity> 
            </LinearGradient>
          </View>
        )
      )}
      
      <RosaryStatusBanner />

      <SaintDetailModal 
        visible={modalVisible}
        saint={saint}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
