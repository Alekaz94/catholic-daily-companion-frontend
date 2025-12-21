import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ActivityIndicator } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { firebaseLogin, loadUserFromStorage } from './src/services/AuthService';
import { RootSiblingParent } from 'react-native-root-siblings';
import { navigationRef } from './src/navigation/RootNavigation';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from './src/context/ThemeContext';
import DrawerNavigatorWrapper from './src/navigation/DrawerNavigatorWrapper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';
import { User } from './src/models/User';
import { NetworkProvider } from './src/context/NetworkContext';
import OfflineBanner from './src/components/OfflineBanner';
import { checkAppVersion } from "./src/services/AppService";
import ForceUpdateModal from "./src/components/ForceUpdateModal";
import SoftUpdateModal from "./src/components/SoftUpdateModal"
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

const SOFT_UPDATE_DISMISSED_VERSION_KEY = "soft_update_dismissed";

export default function App() {
  const [fontsLoaded] = useFonts({
    'Playfair-Bold': require('./src/assets/fonts/Playfair_144pt-Bold.ttf'),
    "Playfair-Regular": require("./src/assets/fonts/Playfair_144pt-Regular.ttf"),
    "Playfair-ExtraBold": require("./src/assets/fonts/Playfair_144pt-ExtraBold.ttf"),
    "Playfair-Italic": require("./src/assets/fonts/Playfair_144pt-Italic.ttf"),
  })

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [forceUpdateUrl, setForceUpdateUrl] = useState<string | null>(null);
  const [showSoftUpdate, setShowSoftUpdate] = useState(false);
  const [softUpdateVersion, setSoftUpdateVersion] = useState<string | null>(null);
  const [softUpdateStoreUrl, setSoftUpdateStoreUrl] = useState<string | null>(null);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !loading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loading]);

  const handleSoftUpdateDismiss = async () => {
    if (softUpdateVersion) {
      await AsyncStorage.setItem(SOFT_UPDATE_DISMISSED_VERSION_KEY, softUpdateVersion);
    }
    setShowSoftUpdate(false);
    setSoftUpdateStoreUrl(null);
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedUser = await loadUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
        }

        onAuthStateChanged(auth, (firebaseUser) => {
          if (!firebaseUser) {
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
    const runVersionCheck = async () => {
      if (!loading && fontsLoaded) {
        const result = await checkAppVersion();
  
        if (result.type === "force-update") {
          setForceUpdateUrl(result.storeUrl);
        }

        if (result.type === "soft-update") {
          const dismissedVersion = await AsyncStorage.getItem(SOFT_UPDATE_DISMISSED_VERSION_KEY);

          if (dismissedVersion !== result.latestVersion) {
            setSoftUpdateVersion(result.latestVersion);
            setSoftUpdateStoreUrl(result.storeUrl);
            setShowSoftUpdate(true);
          }
        }
      }
    };
  
    runVersionCheck();
  }, [loading, fontsLoaded]);

  if(!fontsLoaded || loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ForceUpdateModal
        visible={!!forceUpdateUrl}
        storeUrl={forceUpdateUrl ?? ""}
      />

      <SoftUpdateModal
        visible={showSoftUpdate}
        latestVersion={softUpdateVersion ?? ""}
        storeUrl={softUpdateStoreUrl ?? ""}
        onDismiss={handleSoftUpdateDismiss}
      />

      <RootSiblingParent>
        <AuthProvider>
          <NetworkProvider>
            <SafeAreaProvider>
              <ThemeProvider>
                <OfflineBanner />
                <NavigationContainer ref={navigationRef}>
                  <DrawerNavigatorWrapper />
                </NavigationContainer>
              </ThemeProvider>
            </SafeAreaProvider>
          </NetworkProvider>
        </AuthProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}
