import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Text, TouchableOpacity, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';
import { AppTheme } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

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
      <Text style={Typography.title}>Catholic Daily Companion</Text>
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
        <TouchableOpacity style={[Layout.button, {backgroundColor: "#B794F4", borderRadius: 14, flexDirection: "row", justifyContent: "center", borderWidth: 1, width: "40%", opacity: isLoading ? 0.7 : 1}]} onPress={handleLogin}>
          {isLoading ? (
            <ActivityIndicator color="black" /> 
          ) : (
            <>
              <Ionicons name="log-in-outline" color={"black"} size={20} />
              <Text style={[Layout.buttonText, {marginLeft: 10, color: "black"}]}>Login</Text>
            </>
          )}   
        </TouchableOpacity>

        <View style={{marginLeft: 10, alignSelf: "flex-start"}}>
          <TouchableOpacity
            style={[Layout.button, {backgroundColor: AppTheme.auth.background, padding: 10, marginLeft: 10, flexDirection: "row", justifyContent: "center"}]}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={[Layout.buttonText, {color: AppTheme.auth.primary, fontSize: 12}]}>Dont have an account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmailAndPasswordLoginScreen;