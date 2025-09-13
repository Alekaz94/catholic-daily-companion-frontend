import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { AuthStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { NewUser } from '../models/User';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';
import { AppTheme } from '../styles/colors';
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
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true)
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
    } finally {
      setIsLoading(false);
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
        editable={!isLoading}
      />
      <TextInput
        placeholder="Lastname"
        value={lastName}
        onChangeText={(value) => setLastName(value)}
        style={Layout.input}
        editable={!isLoading}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(value) => setEmail(value)}
        autoCapitalize="none"
        style={Layout.input}
        editable={!isLoading}
      />
      
      <View>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(value) => setPassword(value)}
          secureTextEntry={!showPassword}
          style={Layout.input}
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
      <TouchableOpacity style={[Layout.button, {backgroundColor: "#B794F4", borderRadius: 14, flexDirection: "row", justifyContent: "center", borderWidth: 1, width: "40%", height: 50, opacity: isLoading ? 0.7 : 1}]} onPress={handleSignUp}>
          {isLoading ? (
            <ActivityIndicator color="black" />
          ) : (
            <>
              <Ionicons name="document-text-outline" color={"black"} size={20} />
              <Text style={[Layout.buttonText, {marginLeft: 10, color: "black"}]}>Sign up</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{marginLeft: 20, alignItems: "flex-start", justifyContent: "center", flexDirection: "column"}}>
          <Text style={[Layout.buttonText, {color: "black", fontSize: 14, marginTop: 15}]}>Already have an account?</Text>
          <TouchableOpacity
              style={[Layout.button, {backgroundColor: AppTheme.auth.background}]}
              onPress={() => navigation.navigate("Login")}
          >
              <Text style={[Layout.buttonText, {color: AppTheme.auth.primary, fontSize: 14, marginTop: -20}]}>Login here!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
