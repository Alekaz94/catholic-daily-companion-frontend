import React, { useEffect } from "react";
import { TouchableOpacity, Text, Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { auth } from "../../firebase";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import Constants from 'expo-constants';
import { firebaseLogin } from "../services/AuthService";
import { Layout } from "../styles/Layout";
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const GoogleLogin = () => {
    const getClientId = () => {
        if (Platform.OS === "android") {
          return Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID;
        }
        return Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID;
    };
      
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: getClientId()
    })

    useEffect(() => {
        const authenticate = async () => {  
            if(response?.type === "success" && response.authentication?.idToken) {
                const id_token = response.authentication.idToken;
                const credential = GoogleAuthProvider.credential(id_token);
                const userCredential = await signInWithCredential(auth, credential);

                const firebaseIdToken = await userCredential.user.getIdToken();

                const backendRes = await firebaseLogin(firebaseIdToken);
            }
        }
        authenticate();
    }, [response])

    return (
        <TouchableOpacity style={[Layout.button, {backgroundColor: "#B794F4", flexDirection: "row", justifyContent: "center", borderWidth: 1}]} disabled={!request} onPress={() => promptAsync()}>
            <Ionicons name="logo-google" color={"black"} size={20} />
            <Text style={[Layout.buttonText, {marginLeft: 10, color: "black"}]}>Sign in with Google</Text>
        </TouchableOpacity>
    )
}

export default GoogleLogin;