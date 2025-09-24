import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Text, TouchableOpacity, SafeAreaView, View, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { Layout } from '../styles/Layout';
import { AppTheme } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import cdc_transparent_black from "../assets/images/cdc_transparent_black.png"

type EmailAndPasswordLoginScreen = NativeStackNavigationProp<
  AuthStackParamList,
  'EmailAndPassword'
>;

const EmailAndPasswordLoginScreen = () => {
  const { login } = useAuth();
  const navigation = useNavigation<EmailAndPasswordLoginScreen>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login(email, password);
      alert('Login successfull!');
    } catch (err: any) {
      console.error('Error:', err.response?.data || err.message);
      alert(err.response?.data || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[{ flex: 1, padding: 20, justifyContent: "center", backgroundColor: AppTheme.auth.background }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>  
        <View style={[Layout.container, {justifyContent: "center", alignContent: "center"}]}>
            <Image source={cdc_transparent_black} style={{ height: 250, width: 250, alignSelf: "center", resizeMode: "contain", marginBottom: -70}} />
          <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
            <Ionicons name="mail-outline" color={"black"} size={25} style={{marginBottom: 10}} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(value) => setEmail(value)}
              autoCapitalize="none"
              style={[Layout.input, {width: "90%", marginLeft: 5}]}
              editable={!isLoading}
            />
          </View>

          <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
            <Ionicons name="lock-closed-outline" color={"black"} size={25} style={{marginBottom: 10}}/>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(value) => setPassword(value)}
              secureTextEntry={!showPassword}
              style={[Layout.input, {width: "90%", marginLeft: 5}]}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 16, top: 10 }}
              onPress={() => setShowPassword(prev => !prev)}
            >
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="gray" />
            </TouchableOpacity>
          </View>
          
          <View style={{flexDirection: "row"}}>
            <TouchableOpacity style={[Layout.button, {backgroundColor: "#FAF3E0", height: 50, borderRadius: 14, flexDirection: "row", justifyContent: "center", borderWidth: 1, width: "40%", opacity: isLoading ? 0.7 : 1}]} onPress={handleLogin}>
              {isLoading ? (
                <ActivityIndicator color="black" /> 
              ) : (
                <>
                  <Ionicons name="log-in-outline" color={"black"} size={20} />
                  <Text style={[Layout.buttonText, {marginLeft: 10, color: "black"}]}>Login</Text>
                </>
              )}   
            </TouchableOpacity>

            <View style={{marginLeft: 20, alignItems: "flex-start", justifyContent: "center", flexDirection: "column"}}>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={{ color: "#1E293B", fontSize: 14 }}>
                  Don't have an account?
                </Text>
                <Text style={{fontWeight: 'bold'}}>Sign up here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> 
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EmailAndPasswordLoginScreen;