import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { auth } from "../../firebase";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import Constants from 'expo-constants';
import { Layout } from "../styles/Layout";
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin, User } from '@react-native-google-signin/google-signin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from "../navigation/types";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../hooks/useAppTheme";

type GoogleLoginNavigation = NativeStackNavigationProp<
  AuthStackParamList,
  "GoogleLogin"  
>;

const GoogleLogin = () => {
    const { firebaseLogin } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const theme = useAppTheme();

    useEffect(() => {
        GoogleSignin.configure({
          webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
          offlineAccess: true,
          forceCodeForRefreshToken: true,
        });
    }, []);

      const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        
            const userInfo: User | null = await GoogleSignin.signIn();

            const { idToken } = await GoogleSignin.getTokens();
                
            if (!idToken) {
                throw new Error("No ID token from Google");
            }

            console.log("Signing in with Firebase...");

            const googleCredential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, googleCredential);
            const firebaseIdToken = await userCredential.user.getIdToken();
            
            try{
                await firebaseLogin(firebaseIdToken);
            } catch (error) {
                console.error("Failed to login with Firebase", error);
            }        
        } catch (error) {
            console.error("Google signin error:", error);
        } finally {
            setIsLoading(false);
        }
      };    

    return (
        <TouchableOpacity style={[Layout.button, {backgroundColor: theme.auth.primary, flexDirection: "row", justifyContent: "center", opacity: isLoading ? 0.7 : 1 }]} onPress={handleGoogleLogin}>
            {isLoading ? (
                <ActivityIndicator color={theme.auth.text} />
            ) : (
                <>
                    <Ionicons name="logo-google" color={theme.auth.text} size={20} />
                    <Text style={[Layout.buttonText, {marginLeft: 10, color: theme.auth.text}]}>Sign in with Google</Text>
                </>
            )}
        </TouchableOpacity>
    )
}

export default GoogleLogin;