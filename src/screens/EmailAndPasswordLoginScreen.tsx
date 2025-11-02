import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Text, TouchableOpacity, View, ActivityIndicator, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { Layout } from '../styles/Layout';
import { Ionicons } from '@expo/vector-icons';
import cdc_transparent_black from "../assets/images/cdc_transparent_black.png"
import cdc_transparent from "../assets/images/cdc_transparent.png"
import { useAppTheme } from '../hooks/useAppTheme';
import { useTheme } from '../context/ThemeContext';
import { Controller, useForm } from 'react-hook-form';
import { LoginInput, loginSchema } from '../validation/loginValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-root-toast';

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
  const theme = useAppTheme();
  const {isDark} = useTheme();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const handleLogin = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      Toast.show('Login successful!', {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[{ flex: 1, padding: 20, justifyContent: "center", backgroundColor: theme.auth.background }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> 
        <View style={[Layout.container, {justifyContent: "center", alignContent: "center"}]}>
          <View style={{ position: "absolute", top: 20, left: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color={theme.auth.text} />
            </TouchableOpacity>
          </View> 
          <Image source={isDark ? cdc_transparent : cdc_transparent_black} style={{ height: 250, width: 250, alignSelf: "center", resizeMode: "contain", marginBottom: -70, marginTop: -70}} />
          <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
            <Ionicons name="mail-outline" color={theme.auth.text} size={25} style={{marginBottom: 10}} />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  style={[Layout.input, {width: "90%", marginLeft: 5}]}
                  editable={!isSubmitting}
                />
            )}
            />
          </View>
          {errors.email && <Text style={{ color: 'red', marginTop: -10, marginBottom: 15 }}>{errors.email.message}</Text>}

          <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
            <Ionicons name="lock-closed-outline" color={theme.auth.text} size={25} style={{marginBottom: 10}}/>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!showPassword}
                  style={[Layout.input, {width: "90%", marginLeft: 5}]}
                  editable={!isSubmitting}
                />
              )}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 16, top: 10 }}
              onPress={() => setShowPassword(prev => !prev)}
            >
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="gray" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={{ color: 'red', marginTop: -10, marginBottom: 15 }}>{errors.password.message}</Text>}
          
          <View style={{flexDirection: "row"}}>
            <TouchableOpacity style={[Layout.button, {backgroundColor: theme.auth.primary, height: 50, borderRadius: 14, flexDirection: "row", justifyContent: "center", width: "40%", opacity: isLoading ? 0.7 : 1}]} onPress={handleSubmit(handleLogin)}>
              {isLoading ? (
                <ActivityIndicator color={theme.auth.text} /> 
              ) : (
                <>
                  <Ionicons name="log-in-outline" color={theme.auth.text} size={20} />
                  <Text style={[Layout.buttonText, {marginLeft: 10, color: theme.auth.text}]}>Login</Text>
                </>
              )}   
            </TouchableOpacity>

            <View style={{marginLeft: 20, alignItems: "flex-start", justifyContent: "center", flexDirection: "column"}}>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={{ color: theme.auth.text, fontSize: 14 }}>
                  Don't have an account?
                </Text>
                <Text style={{fontWeight: 'bold', color: theme.auth.text}}>Sign up here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> 
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EmailAndPasswordLoginScreen;