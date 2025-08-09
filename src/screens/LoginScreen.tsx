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

type LoginScreenNavigationScreen = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"  
>;

const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'catholic-daily-companion',
});

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationScreen>();
  const { firebaseLogin } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.GOOGLE_EXPO_CLIENT_ID,
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID,
    webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
    redirectUri,
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

      <TouchableOpacity style={[Layout.button, {backgroundColor: "#DB4437"}]} onPress={() => promptAsync()} disabled={!request}>
        <Text style={Layout.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[Layout.button, {backgroundColor: AppTheme.auth.primary}]} onPress={() => navigation.navigate("EmailAndPassword")}>
        <Text style={Layout.buttonText}>Login with Email & Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[Layout.button, {backgroundColor: AppTheme.auth.primary}]}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={Layout.buttonText}>Create an account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[Layout.button, {backgroundColor: AppTheme.auth.primary}]}
        onPress={() => navigation.navigate("Landing")}
      >
        <Text style={Layout.buttonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>    
  );
}

export default LoginScreen;
