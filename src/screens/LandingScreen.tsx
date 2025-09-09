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
              {saint.imageUrl ? <Image style={Layout.image} source={{ uri: buildImageUri(saint.imageUrl)  }}/> : <Image style={Layout.image} source={defaultSaint}/> }
              <Text style={[Typography.body, {color: "black", marginTop: 10}]} numberOfLines={1} >{saint.biography}</Text>
            </TouchableOpacity> 
          </LinearGradient>
        }
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