import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
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
import { AppTheme } from '../styles/colors';
import Divider from '../components/Divider';
import SectionTitle from './SectionTitle';

type LandingNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Landing"
>

const LandingScreen = () => {
  const navigation = useNavigation<LandingNavigationProp>();
  const [saint, setSaint] = useState<Saint | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchSaintOfTheDay = async () => {
    const todaysSaint = await getSaintOfTheDay();
    if(!todaysSaint) {
      return;
    }
    setSaint(todaysSaint);
  }

  useEffect(() => {
    fetchSaintOfTheDay();
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF3E0"}}>
    <ScrollView 
      style={{backgroundColor: AppTheme.auth.background}}
    >
      <NavbarLanding />
      <Text style={[Typography.title, {textAlign: "center", marginTop: 20, fontFamily: "Playfair-Italic"}]}>Welcome to Catholic Daily Companion</Text>
      <Text style={[Typography.title, {textAlign: "center", fontFamily: "Playfair-Italic"}]}>Start your spiritual journey today</Text>
      <Divider />
      <SectionTitle>🕊️ Daily Inspiration</SectionTitle>
      <QuoteBanner />
      <Divider />
        {!saint 
          ? <View style={{
            borderRadius: 12,
            padding: 16,
            marginVertical: 12,
            backgroundColor: "#FAF3E0" }}
            >
              <Text style={[Typography.label, {textAlign: "center"}]}>No feast day today.</Text>
            </View>
          : <View style={[Layout.container, {backgroundColor: "#F0F9FF"}]}>
            <LinearGradient 
              colors={['#FAF3E0', "#F0F9FF"]}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={[Layout.card, {borderRadius: 12, padding: 15}]}>
            <Text style={[Typography.label, {textAlign: "center", marginBottom: 10}]}>Today is the feast day of {saint?.name}</Text>
            <TouchableOpacity 
              onPress={() => {
                setModalVisible(true);
              }}
              style={{alignItems: "center"}}
            >
              {saint.imageUrl ? <Image style={Layout.image} source={{ uri: buildImageUri(saint.imageUrl)  }}/> : <Image style={Layout.image} source={defaultSaint}/> }
              <Text style={[Typography.label, { marginTop: 10 }]} >{saint.name}</Text>
            </TouchableOpacity> 
          </LinearGradient>
          </View>
    }
    
    <Divider />
    <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
      <Text style={[Typography.title, { fontSize: 18, textAlign: 'center', marginBottom: 10 }]}>
        What You’ll Get:
      </Text>
      <Text style={Typography.label}>• Daily Saint of the Day</Text>
      <Text style={Typography.label}>• Inspirational Quotes</Text>
      <Text style={Typography.label}>• Rosary Tracker</Text>
      <Text style={Typography.label}>• Personal Journal Prompts</Text>
    </View>
    
    <View style={{alignItems: "center", marginTop: 30, marginBottom: 40}}>
      <TouchableOpacity 
        style={{
          backgroundColor: "#FAF3E0",
          paddingVertical: 12,
          paddingHorizontal: 32,
          borderRadius: 8,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: "black"
        }}
        onPress={() => navigation.navigate("Signup")}  
      >
        <Text style={{color: "black", fontSize: 16}}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ color: "#1E293B", fontSize: 14 }}>
          Already have an account? <Text style={{fontWeight: 'bold'}}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
    
    <SaintDetailModal 
      visible={modalVisible}
      saint={saint}
      onClose={() => setModalVisible(false)}
    />
    </ScrollView>
    </SafeAreaView>
  );
};

export default LandingScreen;