import React, { useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import { auth } from "../../firebase";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import Constants from 'expo-constants';
import { firebaseLogin } from "../services/AuthService";
import { Layout } from "../styles/Layout";
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SignInResponse, statusCodes } from '@react-native-google-signin/google-signin';

const GoogleLogin = () => {
    useEffect(() => {
        GoogleSignin.configure({
          webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
          offlineAccess: true,
          forceCodeForRefreshToken: true,
        });
      }, []);

      const handleGoogleLogin = async () => {
        try {
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
        }
      };

    return (
        <TouchableOpacity style={[Layout.button, {backgroundColor: "#B794F4", flexDirection: "row", justifyContent: "center", borderWidth: 1}]} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" color={"black"} size={20} />
            <Text style={[Layout.buttonText, {marginLeft: 10, color: "black"}]}>Sign in with Google</Text>
        </TouchableOpacity>
    )
}

export default GoogleLogin;