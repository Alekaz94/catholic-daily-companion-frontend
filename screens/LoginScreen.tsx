import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';

type LoginNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const { login } = useAuth();
  const navigation = useNavigation<LoginNavigationProp>();
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
    <View style={[Layout.container, {justifyContent: "center"}]}>
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
      <TouchableOpacity style={Layout.button} onPress={handleLogin}>
        <Text style={Layout.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={Layout.button}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={Layout.buttonText}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
