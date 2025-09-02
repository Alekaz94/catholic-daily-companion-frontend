import React, { useEffect } from "react";
import { TouchableOpacity, Text, Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { auth } from "../../firebase";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import Constants from 'expo-constants';
import { firebaseLogin } from "../services/AuthService";
import { Layout } from "../styles/Layout";
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({
    native: "catholic-daily-companion://oauthredirect",
});

const isDevelopment = __DEV__;

const androidClientId = isDevelopment
  ? Constants.expoConfig?.extra?.GOOGLE_ANDROID_DEBUG_CLIENT_ID
  : Constants.expoConfig?.extra?.GOOGLE_ANDROID_RELEASE_CLIENT_ID;


const GoogleLogin = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId,
        webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({
          native: "catholic-daily-companion://oauthredirect",
        }),
        scopes: ['profile', 'email'],
    });

      useEffect(() => {
        console.log("Client IDs:", {
          androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID,
          webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
          redirectUri
        });
      }, []);

    useEffect(() => {
        const authenticate = async () => {  
            if(response?.type === "success" && response.authentication?.idToken) {
                const id_token = response.authentication.idToken;
                const credential = GoogleAuthProvider.credential(id_token);
                const userCredential = await signInWithCredential(auth, credential);

                const firebaseIdToken = await userCredential.user.getIdToken();

                await firebaseLogin(firebaseIdToken);
            }
        }
        authenticate();
    }, [response])

    useEffect(() => {
        console.log("Google response:", response);
      }, [response]);

    return (
        <TouchableOpacity style={[Layout.button, {backgroundColor: "#B794F4", flexDirection: "row", justifyContent: "center", borderWidth: 1}]} disabled={!request} onPress={() => promptAsync()}>
            <Ionicons name="logo-google" color={"black"} size={20} />
            <Text style={[Layout.buttonText, {marginLeft: 10, color: "black"}]}>Sign in with Google</Text>
        </TouchableOpacity>
    )
}

export default GoogleLogin;