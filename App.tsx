import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ActivityIndicator, AppState } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { firebaseLogin, loadUserFromStorage } from './src/services/AuthService';
import { RootSiblingParent } from 'react-native-root-siblings';
import { navigationRef } from './src/navigation/RootNavigation';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from './src/context/ThemeContext';
import DrawerNavigatorWrapper from './src/navigation/DrawerNavigatorWrapper';
import axios from 'axios';
import { configureNotifications, scheduleAllNotifications } from './src/services/NotificationHandler';
import { User } from './src/models/User';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Playfair-Bold': require('./src/assets/fonts/Playfair_144pt-Bold.ttf'),
    "Playfair-Regular": require("./src/assets/fonts/Playfair_144pt-Regular.ttf"),
    "Playfair-ExtraBold": require("./src/assets/fonts/Playfair_144pt-ExtraBold.ttf"),
    "Playfair-Italic": require("./src/assets/fonts/Playfair_144pt-Italic.ttf"),
  })

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !loading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loading]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedUser = await loadUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
        }

        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const idToken = await firebaseUser.getIdToken();
              await firebaseLogin(idToken);
              
              const updatedUser = await loadUserFromStorage();
              if (updatedUser) {
                setUser(updatedUser);
              }
            } catch (error) {
              if (axios.isAxiosError(error)) {
                console.error("Firebase login error:", error.response?.data || error.message);
              } else {
                console.error("Unknown error during Firebase login:", error);
              }
            }
          } else {
            setUser(null);
          }
        });
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if(!user) {
      return;
    }

    configureNotifications();
    scheduleAllNotifications(user.id);
  }, [user]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if(state === "active" && user) {
        console.log("App became active - rechecking notifications");
        await scheduleAllNotifications(user.id);
      }
    });

    return () => sub.remove();
  }, [user])

  if(!fontsLoaded || loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <RootSiblingParent>
        <AuthProvider>
          <ThemeProvider>
            <NavigationContainer ref={navigationRef}>
              <DrawerNavigatorWrapper />
            </NavigationContainer>
          </ThemeProvider>
        </AuthProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}
