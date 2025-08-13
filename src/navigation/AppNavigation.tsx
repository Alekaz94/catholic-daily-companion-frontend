import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from "../context/AuthContext";
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import JournalEntryListScreen from "../screens/JournalEntryListScreen"
import { AuthStackParamList } from './types';
import SaintScreen from '../screens/SaintScreen';
import DailyReadingScreen from '../screens/DailyReadingScreen';
import JournalEntryCreateScreen from '../screens/JournalEntryCreateScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LandingScreen from "../screens/LandingScreen";
import React from 'react';
import EmailAndPasswordLoginScreen from '../screens/EmailAndPasswordLoginScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import PrayerScreen from '../screens/PrayerScreen';
import RosaryScreen from '../screens/RosaryScreen';
import PrayerListScreen from '../screens/PrayerListScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          {user.role === "ADMIN" && <Stack.Screen name='AdminPanel' component={AdminPanelScreen} />}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Saint" component={SaintScreen} />
          <Stack.Screen name="Reading" component={DailyReadingScreen} />
          <Stack.Screen name="Journal" component={JournalEntryListScreen} />
          <Stack.Screen name="CreateJournalEntry" component={JournalEntryCreateScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Prayer" component={PrayerScreen} />
          <Stack.Screen name="Rosary" component={RosaryScreen} />
          <Stack.Screen name="PrayerList" component={PrayerListScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="EmailAndPassword" component={EmailAndPasswordLoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
