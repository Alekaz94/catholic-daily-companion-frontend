import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { auth } from "../../firebase";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import Constants from 'expo-constants';
import { Layout } from "../styles/Layout";
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SignInResponse } from '@react-native-google-signin/google-signin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from "../navigation/types";
import { useAuth } from "../context/AuthContext";

type GoogleLoginNavigation = NativeStackNavigationProp<
  AuthStackParamList,
  "GoogleLogin"  
>;

const GoogleLogin = () => {
    const { firebaseLogin } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

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
        
            const result: SignInResponse | null = await GoogleSignin.signIn();

            if (result.type !== 'success') {
                console.warn("Google Sign-In was cancelled or failed");
                return;
              }

                const idToken = result.data.idToken;
                const user = result.data.user;
                
            if (!idToken) {
                throw new Error("No ID token from Google");
            }
      
            const googleCredential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, googleCredential);
            const firebaseIdToken = await userCredential.user.getIdToken();
        
            await firebaseLogin(firebaseIdToken);
        
            console.log("✅ User signed in:", user.email);
        } catch (error) {
            console.error("❌ Google signin error:", error);
        } finally {
            setIsLoading(false);
        }
      };    

    return (
        <TouchableOpacity style={[Layout.button, {backgroundColor: "#FAF3E0", flexDirection: "row", justifyContent: "center", borderWidth: 1, opacity: isLoading ? 0.7 : 1 }]} onPress={handleGoogleLogin}>
            {isLoading ? (
                <ActivityIndicator color="black" />
            ) : (
                <>
                    <Ionicons name="logo-google" color={"black"} size={20} />
                    <Text style={[Layout.buttonText, {marginLeft: 10, color: "black"}]}>Sign in with Google</Text>
                </>
            )}
        </TouchableOpacity>
    )
}

export default GoogleLogin;