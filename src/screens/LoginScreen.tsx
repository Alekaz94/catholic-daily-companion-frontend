import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import * as Google from "expo-auth-session/providers/google"
import { useEffect } from "react";
import { Text, TouchableOpacity, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Layout } from "../styles/Layout";
import Constants from "expo-constants";
import { Ionicons } from '@expo/vector-icons';
import GoogleLogin from "../components/GoogleLogin";
import cdc_transparent_black from "../assets/images/cdc_transparent_black.png"
import cdc_transparent from "../assets/images/cdc_transparent.png"
import { useAppTheme } from "../hooks/useAppTheme";
import { useTheme } from "../context/ThemeContext";

type LoginScreenNavigationScreen = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"  
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationScreen>();
  const { firebaseLogin } = useAuth();
  const theme = useAppTheme();
  const {isDark} = useTheme();

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
    <SafeAreaView style={[Layout.container, {justifyContent: "center", backgroundColor: theme.auth.background}]}>
      <View style={[Layout.container, {justifyContent: "center", alignContent: "center"}]}>
        <View style={{ position: "absolute", top: 20, left: 2}}>
          <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
            <Ionicons name="arrow-back" size={28} color={theme.auth.text} />
          </TouchableOpacity>
        </View>
        <Image source={isDark ? cdc_transparent : cdc_transparent_black} style={{ height: 250, width: 250, alignSelf: "center", resizeMode: "contain", marginBottom: -70, marginTop: -70}} />

        <GoogleLogin />

        {/* <TouchableOpacity style={[Layout.button, {backgroundColor: theme.auth.primary, flexDirection: "row", justifyContent: "center", borderWidth: 1}]} onPress={() => navigation.navigate("EmailAndPassword")}>
          <Ionicons name="mail-outline" color={theme.auth.text} size={20} />
          <Text style={[Layout.buttonText, {marginLeft: 10, color: theme.auth.text}]}>Login with Email & Password</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>    
  );
}

export default LoginScreen;
