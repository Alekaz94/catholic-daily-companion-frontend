import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';
import { AppTheme, Colors } from '../styles/colors';

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
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(value) => setEmail(value)}
        autoCapitalize="none"
        style={Layout.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(value) => setPassword(value)}
        secureTextEntry
        style={Layout.input}
      />
      <TouchableOpacity style={[Layout.button, {backgroundColor: Colors.success}]} onPress={handleLogin}>
        <Text style={Layout.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[Layout.button, {backgroundColor: AppTheme.auth.primary}]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={Layout.buttonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EmailAndPasswordLoginScreen;