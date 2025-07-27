import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AuthStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getTodaysReading } from '../services/DailyReadingService';
import { DailyReading } from '../models/DailyReading';
import { Saint } from '../models/Saint';
import { getSaintOfTheDay } from '../services/SaintService';
import SaintDetailModal from '../components/SaintDetailModal';
import defaultSaintImage from '../assets/images/default_saint.png';
import Navbar from '../components/Navbar';
import { Typography } from '../styles/Typography';
import { Layout } from '../styles/Layout';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme } from '../styles/colors';

type HomeNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Home"
>

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
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
    <SafeAreaView style={{ flex: 1 }}>
      <Navbar />
      <Text style={[Typography.title, {alignSelf: "center", fontSize: 20, fontWeight: "bold", marginTop: 10}]}>Welcome to Catholic Daily Companion</Text>
      <View style={[Layout.container, {marginBottom: -20, backgroundColor: "#F0F9FF"}]}>
        <Text style={[Typography.label, {fontSize: 20}]}>Today is the feast day of {saint?.name}</Text>
        {!saint 
          ? <View style={[Layout.card, {marginTop: 10, borderRadius: 12, padding: 15}]}>
              <Text style={[Typography.label, {fontSize: 16, color: "white"}]}>No Saint's feast day today.</Text>
            </View>
          : <LinearGradient 
              colors={['#FFD700', '#FAF3E0']}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={[Layout.card, {borderRadius: 12, padding: 15}]}>
            <TouchableOpacity 
              onPress={() => {
                setModalVisible(true);
              }}
            >
                <Image style={Layout.image} source={saint.imageUrl ? { uri: saint.imageUrl } : defaultSaintImage} />
                <Text style={[Typography.body, {color: "black"}]} numberOfLines={1} >{saint.biography}</Text>
            </TouchableOpacity> 
          </LinearGradient>
        }
      </View>
      <View style={Layout.container}>
      <View style={[Layout.card, {marginTop: 10, borderRadius: 12, padding: 15, backgroundColor: AppTheme.reading.background}]}>
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
    </SafeAreaView>
  );
};

export default HomeScreen;
