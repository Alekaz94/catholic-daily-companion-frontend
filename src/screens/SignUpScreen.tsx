import { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { AuthStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { NewUser } from '../models/User';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';
import { AppTheme, Colors } from '../styles/colors';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type SignupNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Signup'
>;

const SignUpScreen = () => {
  const { signup, user } = useAuth();
  const navigation = useNavigation<SignupNavigationProp>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      alert('Please fill out all the fields!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email adress!');
      return;
    }

    if (password.length < 8) {
      alert('Password must be atleast 8 characters long!');
      return;
    }

    try {
      const newUser: NewUser = {
        firstName,
        lastName,
        email,
        password,
      };
      await signup(newUser);
      alert('Signup successfull!');
    } catch (err: any) {
      console.error('Error:', err.response?.data || err.message);
      alert(err.response?.data || 'Something went wrong!');
    }
  };

  useEffect(() => {
    if(user) {
      navigation.navigate('Home');
    }
  }, [user])

  return (
      <SafeAreaView style={[Layout.container,{ justifyContent: "center", backgroundColor: AppTheme.auth.background}]}>        
      <Text style={Typography.title}>Catholic Daily Companion</Text>
      <TextInput
        placeholder="Firstname"
        value={firstName}
        onChangeText={(value) => setFirstName(value)}
        style={Layout.input}
      />
      <TextInput
        placeholder="Lastname"
        value={lastName}
        onChangeText={(value) => setLastName(value)}
        style={Layout.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(value) => setEmail(value)}
        autoCapitalize="none"
        style={Layout.input}
      />
      
      <View>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(value) => setPassword(value)}
          secureTextEntry={!showPassword}
          style={Layout.input}
        />
        <TouchableOpacity
          style={{ position: 'absolute', right: 16, top: 10 }}
          onPress={() => setShowPassword(prev => !prev)}
        >
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[Layout.button, {backgroundColor: Colors.success, borderWidth: 1}]} onPress={handleSignUp}>
        <Text style={[Layout.buttonText, {color: "black"}]}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[Layout.button, {backgroundColor: "#B794F4", flexDirection: "row", justifyContent: "center", borderWidth: 1}]}
        onPress={() => navigation.navigate("Login")}
      >
        <Ionicons name='arrow-back' color={"black"} size={20} />
        <Text style={[Layout.buttonText, {marginLeft: 10, color: "black"}]}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignUpScreen;
