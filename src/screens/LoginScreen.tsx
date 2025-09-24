import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import * as Google from "expo-auth-session/providers/google"
import { useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import { AppTheme } from "../styles/colors";
import Constants from "expo-constants";
import { Ionicons } from '@expo/vector-icons';
import GoogleLogin from "../components/GoogleLogin";
import cdc_transparent_black from "../assets/images/cdc_transparent_black.png"

type LoginScreenNavigationScreen = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"  
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationScreen>();
  const { firebaseLogin } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.GOOGLE_EXPO_CLIENT_ID,
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID,
    webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
  })

  useEffect(() => {
    const handleEffect = async () => {
      if(response?.type === "success") {
        const { idToken } = response.authentication!;
        await firebaseLogin(idToken);
      }
    };
    handleEffect();
  }, [response])

  return (
    <SafeAreaView style={[Layout.container, {justifyContent: "center", backgroundColor: AppTheme.auth.background}]}>
      <Image source={cdc_transparent_black} style={{ height: 250, width: 250, alignSelf: "center", resizeMode: "contain", marginBottom: -70}} />

      <GoogleLogin />

      <TouchableOpacity style={[Layout.button, {backgroundColor: "#FAF3E0", flexDirection: "row", justifyContent: "center", borderWidth: 1}]} onPress={() => navigation.navigate("EmailAndPassword")}>
        <Ionicons name="mail-outline" color={"black"} size={20} />
        <Text style={[Layout.buttonText, {marginLeft: 10, color: "black"}]}>Login with Email & Password</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[Layout.button, {backgroundColor: "#FAF3E0", flexDirection: "row", justifyContent: "center", borderWidth: 1}]}
        onPress={() => navigation.navigate("Landing")}
      >
        <Ionicons name="arrow-back" color={"black"} size={20} />
        <Text style={[Layout.buttonText, {marginLeft: 10, color: "black"}]}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>    
  );
}

export default LoginScreen;
