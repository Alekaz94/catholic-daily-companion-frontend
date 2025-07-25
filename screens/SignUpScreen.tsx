import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { AuthStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { NewUser } from '../models/User';
import { Layout } from '../styles/Layout';
import { Typography } from '../styles/Typography';

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
    <View style={[Layout.container, {justifyContent: "center", alignContent: "center"}]}>
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
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(value) => setPassword(value)}
        secureTextEntry
        style={Layout.input}
      />
      <TouchableOpacity style={Layout.button} onPress={handleSignUp}>
        <Text style={Layout.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={Layout.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={Layout.buttonText}>Already have an account?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={Layout.button}
        onPress={() => navigation.navigate("Landing")}
      >
        <Text style={Layout.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
