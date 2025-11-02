import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import { AuthStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../styles/Layout';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import cdc_transparent_black from "../assets/images/cdc_transparent_black.png"
import cdc_transparent from "../assets/images//cdc_transparent.png"
import { useAppTheme } from '../hooks/useAppTheme';
import { useTheme } from '../context/ThemeContext';
import { SignupInput, signUpSchema } from '../validation/signupValidation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-root-toast';

type SignupNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Signup'
>;

const SignUpScreen = () => {
  const { signup, user } = useAuth();
  const navigation = useNavigation<SignupNavigationProp>();
  const theme = useAppTheme();
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      await signup(data);
      Toast.show('Signup successful!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } catch (err: any) {
      Toast.show(err.response?.data || 'Something went wrong!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: 'red',
        textColor: 'white',
      });
    }
  };

  useEffect(() => {
    if(user) {
      navigation.navigate('Home');
    }
  }, [user])

  return (
      <SafeAreaView style={[Layout.container,{ justifyContent: "center", backgroundColor: theme.auth.background}]}> 
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> 
          <View style={[Layout.container, {justifyContent: "center", alignContent: "center"}]}>
            <View style={{ position: "absolute", top: 20, left: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
                <Ionicons name="arrow-back" size={28} color={theme.auth.text} />
              </TouchableOpacity>
            </View>

            <Image source={isDark ? cdc_transparent : cdc_transparent_black} style={{ height: 250, width: 250, alignSelf: "center", resizeMode: "contain", marginBottom: -70, marginTop: -70}} />
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Firstname"
                  value={value}
                  onChangeText={onChange}
                  style={Layout.input}
                  editable={!isSubmitting}
                />
              )}
            />
            {errors.firstName && <Text style={{ color: 'red', marginTop: -10, marginBottom: 15 }}>{errors.firstName.message}</Text>}

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Lastname"
                  value={value}
                  onChangeText={onChange}
                  style={Layout.input}
                  editable={!isSubmitting}
                />
              )}
            />
            {errors.lastName && <Text style={{ color: 'red', marginTop: -10, marginBottom: 15 }}>{errors.lastName.message}</Text>}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={Layout.input}
                  editable={!isSubmitting}
                />
              )}
            />
            {errors.email && <Text style={{ color: 'red', marginTop: -10, marginBottom: 15 }}>{errors.email.message}</Text>}
          
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    style={Layout.input}
                    editable={!isSubmitting}
                  />
                  <TouchableOpacity
                    style={{ position: 'absolute', right: 16, top: 10 }}
                    onPress={() => setShowPassword(prev => !prev)}
                  >
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="gray" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && <Text style={{ color: 'red', marginTop: -10, marginBottom: 15 }}>{errors.password.message}</Text>}

            <View style={{flexDirection: "row"}}>
            <TouchableOpacity style={[Layout.button, {backgroundColor: theme.auth.primary, borderRadius: 14, flexDirection: "row", justifyContent: "center", width: "40%", height: 50}]} onPress={handleSubmit(onSubmit)}>
                {isSubmitting ? (
                  <ActivityIndicator color={theme.auth.text} />
                ) : (
                  <>
                    <Ionicons name="document-text-outline" color={theme.auth.text} size={20} />
                    <Text style={[Layout.buttonText, {marginLeft: 10, color: theme.auth.text}]}>Sign up</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={{marginLeft: 20, alignItems: "flex-start", justifyContent: "center", flexDirection: "column"}}>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={{ color: theme.auth.text, fontSize: 14 }}>
                    Already have an account?
                  </Text>
                  <Text style={{fontWeight: 'bold', color: theme.auth.text}}>Log in </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignUpScreen;
