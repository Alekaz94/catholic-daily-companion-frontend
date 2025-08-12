import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Text, TouchableOpacity, SafeAreaView, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';
import { AppTheme, Colors } from '../styles/colors';
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

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert('Login successfull!');
    } catch (err: any) {
      console.error('Error:', err.response?.data || err.message);
      alert(err.response?.data || 'Something went wrong!');
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
        />
      </View>
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
        <Ionicons name="lock-closed-outline" color={"black"} size={25} style={{marginBottom: 10}}/>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(value) => setPassword(value)}
          secureTextEntry
          style={[Layout.input, {width: "90%", marginLeft: 5}]}
        />
      </View>
      <TouchableOpacity style={[Layout.button, {backgroundColor: Colors.success, flexDirection: "row", justifyContent: "center"}]} onPress={handleLogin}>
        <Ionicons name="log-in-outline" color={"white"} size={20} />
        <Text style={[Layout.buttonText, {marginLeft: 10}]}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[Layout.button, {backgroundColor: AppTheme.auth.primary, flexDirection: "row", justifyContent: "center"}]}
        onPress={() => navigation.navigate("Login")}
      >
        <Ionicons name='arrow-back' color={"white"} size={20} />
        <Text style={[Layout.buttonText, {marginLeft: 10}]}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EmailAndPasswordLoginScreen;