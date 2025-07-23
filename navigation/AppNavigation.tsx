import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import JournalEntryListScreen from "../screens/JournalEntryListScreen"
import { AuthStackParamList } from '../navigation/types';
import SaintScreen from '../screens/SaintScreen';
import DailyReadingScreen from '../screens/DailyReadingScreen';
import JournalEntryCreateScreen from '../screens/JournalEntryCreateScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Saint" component={SaintScreen} />
          <Stack.Screen name="Reading" component={DailyReadingScreen} />
          <Stack.Screen name="Journal" component={JournalEntryListScreen} />
          <Stack.Screen name="CreateJournalEntry" component={JournalEntryCreateScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
