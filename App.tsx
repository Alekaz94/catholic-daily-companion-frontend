import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation/AppNavigation';
import { AuthProvider } from './src/context/AuthContext';
import { firebaseLogin, loadUserFromStorage } from './src/services/AuthService';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
              console.error('Firebase login error:', error);
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

  if(loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
