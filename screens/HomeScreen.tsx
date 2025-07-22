import React from 'react';
import LogoutButton from "../components/LogoutButton"
import { Text, SafeAreaView, Button } from 'react-native';
import { AuthStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Home"
>

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="My journal" onPress={() => navigation.navigate("Journal")}/>
      <Button title="Saints" onPress={() => navigation.navigate("Saint")}/>
      <LogoutButton />
      <Text>Welcome to Catholic Daily Companion</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
