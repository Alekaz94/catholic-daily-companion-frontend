import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { AuthStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getTodaysReading } from '../services/DailyReadingService';
import { DailyReading } from '../models/DailyReading';
import { Saint } from '../models/Saint';
import { getSaintOfTheDay } from '../services/SaintService';
import SaintDetailModal from '../components/SaintDetailModal';
import NavbarLanding from '../components/NavbarLanding';
import { Typography } from '../styles/Typography';
import { Layout } from '../styles/Layout';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme } from '../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { buildImageUri } from '../utils/imageUtils';

type LandingNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Landing"
>

const LandingScreen = () => {
  const navigation = useNavigation<LandingNavigationProp>();
  const [reading, setReading] = useState<DailyReading | null>(null);
  const [saint, setSaint] = useState<Saint | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchTodaysReading = async () => {
    const todaysReading = await getTodaysReading();
    if(!todaysReading) {
      return;
    }
    setReading(todaysReading);
  }

  const fetchSaintOfTheDay = async () => {
    const todaysSaint = await getSaintOfTheDay();
    if(!todaysSaint) {
      return;
    }
    setSaint(todaysSaint);
  }

  useEffect(() => {
    fetchTodaysReading();
    fetchSaintOfTheDay();
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF3E0"}}>
      <ScrollView style={{backgroundColor: "#F0F9FF"}}>         
      <NavbarLanding />
      <Text style={[Typography.title, {alignSelf: "center", fontSize: 20, fontWeight: "bold", marginTop: 10}]}>Welcome to Catholic Daily Companion</Text>
      <View style={[Layout.container, {marginBottom: -20, backgroundColor: "#F0F9FF"}]}>
        <Text style={[Typography.label, {fontSize: 20}]}>Today is the feast day of {saint?.name}</Text>
        {!saint 
          ? <View style={[Layout.card, {marginTop: 10, borderRadius: 12, padding: 15, backgroundColor: "#FAF3E0"}]}>
              <Text style={[Typography.label, {fontSize: 16, color: "black"}]}>No Saint's feast day today.</Text>
            </View>
          : <LinearGradient 
              colors={['#FAF3E0', "#F0F9FF"]}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={[Layout.card, {borderRadius: 12, padding: 15}]}>
            <TouchableOpacity 
              onPress={() => {
                setModalVisible(true);
              }}
            >
              {saint.imageUrl ? <Image style={Layout.image} source={{ uri: buildImageUri(saint.imageUrl)  }}/> : <Ionicons name="man-outline" size={50} color="#1A1A1A" style={{alignSelf: "center"}}/> }
              <Text style={[Typography.body, {color: "black", marginTop: 10}]} numberOfLines={1} >{saint.biography}</Text>
            </TouchableOpacity> 
          </LinearGradient>
        }
      </View>
      <View style={Layout.container}>
      <View style={[Layout.card, {marginTop: 10, borderRadius: 12, padding: 15, backgroundColor: "#FAF3E0"}]}>
        <Text style={[Typography.label, {fontSize: 20}]}>Today's readings</Text>
        {!reading ? (
          <Text style={[Typography.label, {fontSize: 16}]}>No reading found for today!</Text>
        ) : (
          <>
            <Text style={[Typography.label, {marginBottom: 5, marginTop: 5, color: AppTheme.reading.text}]}>First reading </Text>
            <Text style={[Typography.body, {color: AppTheme.reading.text}]}>{reading?.firstReading}</Text>
            <Text style={[Typography.label, {marginBottom: 5, marginTop: 5, color: AppTheme.reading.text}]}>Second reading </Text>
            <Text style={[Typography.body, {color: AppTheme.reading.text}]}>{reading?.secondReading}</Text>
            <Text style={[Typography.label, {marginBottom: 5, marginTop: 5, color: AppTheme.reading.text}]}>Psalm </Text>
            <Text style={[Typography.body, {color: AppTheme.reading.text}]}>{reading?.psalm}</Text>
            <Text style={[Typography.label, {marginBottom: 5, marginTop: 5, color: AppTheme.reading.text}]}>Gospel reading </Text>
            <Text style={[Typography.body, {color: AppTheme.reading.text}]}>{reading?.gospel}</Text> 
          </>
        )}     
      </View>
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