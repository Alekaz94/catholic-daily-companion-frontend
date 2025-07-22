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
      <Text style={styles.title}>Welcome to Catholic Daily Companion</Text>
      <View style={styles.view}>
        <Text style={styles.title}>Today is the feast day of:</Text>
        {!saint ? <Text style={styles.NoSaintOrReadingFoundText}>No Saint's feast day today.</Text>
          :
          <TouchableOpacity onPress={() => {
            setModalVisible(true);
          }}>
            <Text style={styles.saintName}>{saint?.name}</Text>
            <Image style={styles.saintImage} source={saint.imageUrl ? { uri: saint.imageUrl } : defaultSaintImage} />
          </TouchableOpacity> 
        }
      </View>

      <View style={styles.view}>
        <Text style={styles.title}>Today's readings</Text>
        {!reading ? (
          <Text style={styles.NoSaintOrReadingFoundText}>No reading found for today!</Text>
        ) : (
          <>
            <Text style={styles.readingTitle}>First reading </Text>
            <Text style={styles.readings}>{reading?.firstReading}</Text>
            <Text style={styles.readingTitle}>Second reading </Text>
            <Text style={styles.readings}>{reading?.secondReading}</Text>
            <Text style={styles.readingTitle}>Psalm </Text>
            <Text style={styles.readings}>{reading?.psalm}</Text>
            <Text style={styles.readingTitle}>Gospel reading </Text>
            <Text style={styles.readings}>{reading?.gospel}</Text> 
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

const styles = StyleSheet.create({
  view: {
    flex: 1, 
    flexDirection: "column",
    alignContent: "center",
    margin: 5
  },
  saintImage: { 
    width: 150, 
    height: 150, 
    borderRadius: 50, 
    alignSelf: "center"
  },
  title: {
    fontSize: 16, 
    fontWeight: "bold",
    alignSelf: "center",
    margin: 2
  },
  NoSaintOrReadingFoundText: {
    fontSize: 12,
    alignSelf: "center"
  },
  saintName: {
    fontSize: 12,
    alignSelf: "center"
  },
  readingTitle: {
    fontSize: 12,
    alignSelf: "center",
    fontWeight: "600"
  },
  text: {
  fontSize: 16
  },
  date: {
    marginVertical: 10, 
    fontSize: 10
  },
  readings: {
    fontSize: 14,
    marginBottom: 16,
    padding: 2
  }
})

export default HomeScreen;
