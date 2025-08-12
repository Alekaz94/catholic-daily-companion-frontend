import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import * as Google from "expo-auth-session/providers/google"
import { useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Typography } from "../styles/Typography";
import { Layout } from "../styles/Layout";
import { AppTheme } from "../styles/colors";
import Constants from "expo-constants";
import * as AuthSession from "expo-auth-session";
import { Ionicons } from '@expo/vector-icons';

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
      <Text style={[Typography.title, {marginBottom: 40}]}>Catholic Daily Companion</Text>

      <TouchableOpacity style={[Layout.button, {backgroundColor: "#DB4437", flexDirection: "row", justifyContent: "center"}]} onPress={() => promptAsync()} disabled={!request}>
        <Ionicons name="logo-google" color={"white"} size={20} />
        <Text style={[Layout.buttonText, {marginLeft: 10}]}>Login with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[Layout.button, {backgroundColor: AppTheme.auth.primary, flexDirection: "row", justifyContent: "center"}]} onPress={() => navigation.navigate("EmailAndPassword")}>
        <Ionicons name="mail-outline" color={"white"} size={20} />
        <Text style={[Layout.buttonText, {marginLeft: 10}]}>Login with Email & Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[Layout.button, {backgroundColor: AppTheme.auth.primary, flexDirection: "row", justifyContent: "center"}]}
        onPress={() => navigation.navigate('Signup')}
      >
        <Ionicons name="create-outline" color={"white"} size={20} />
        <Text style={[Layout.buttonText, {marginLeft: 10}]}>Create an account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[Layout.button, {backgroundColor: AppTheme.auth.primary, flexDirection: "row", justifyContent: "center"}]}
        onPress={() => navigation.navigate("Landing")}
      >
        <Ionicons name="arrow-back" color={"white"} size={20} />
        <Text style={[Layout.buttonText, {marginLeft: 10}]}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>    
  );
}

export default LoginScreen;
