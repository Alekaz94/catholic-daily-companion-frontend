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
      <View style={[Layout.container, {marginBottom: -20}]}>
        <Text style={[Typography.label, {fontSize: 20}]}>Today is the feast day of {saint?.name}</Text>
        {!saint ? <Text style={[Typography.label, {fontSize: 20}]}>No Saint's feast day today.</Text>
          :
          <TouchableOpacity style={Layout.card} onPress={() => {
            setModalVisible(true);
          }}>
            <Image style={Layout.image} source={saint.imageUrl ? { uri: saint.imageUrl } : defaultSaintImage} />
          </TouchableOpacity> 
        }
      </View>

      <View style={Layout.container}>
        <Text style={[Typography.label, {fontSize: 20}]}>Today's readings</Text>
        {!reading ? (
          <Text style={Typography.small}>No reading found for today!</Text>
        ) : (
          <>
            <Text style={[Typography.label, {marginBottom: 5, marginTop: 5}]}>First reading </Text>
            <Text style={Typography.body}>{reading?.firstReading}</Text>
            <Text style={[Typography.label, {marginBottom: 5, marginTop: 5}]}>Second reading </Text>
            <Text style={Typography.body}>{reading?.secondReading}</Text>
            <Text style={[Typography.label, {marginBottom: 5, marginTop: 5}]}>Psalm </Text>
            <Text style={Typography.body}>{reading?.psalm}</Text>
            <Text style={[Typography.label, {marginBottom: 5, marginTop: 5}]}>Gospel reading </Text>
            <Text style={Typography.body}>{reading?.gospel}</Text> 
          </>
        )}     
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
