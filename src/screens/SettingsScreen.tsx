import { View, Text, Switch, ScrollView } from "react-native"; 
import { useAppTheme } from "../hooks/useAppTheme"; 
import { useTheme } from "../context/ThemeContext"; 
import { Typography } from "../styles/Typography"; 
import Navbar from "../components/Navbar"; 
import Divider from "../components/Divider"; 
import { Layout } from "../styles/Layout"; 
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => { 
    const theme = useAppTheme(); 
    const { isDark, toggleTheme } = useTheme(); 
    
    return ( 
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.navbar}}> 
            <ScrollView keyboardShouldPersistTaps="handled" style={{backgroundColor: theme.auth.background}}> 
                <Navbar /> 
                <View style={Layout.container}> 
                    <Text style={[Typography.italic, {textAlign: "center", fontSize: 22, fontWeight: "600", color: theme.auth.text}]}>Settings</Text> 
                    <Divider /> 
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10}}> 
                        <Text style={[Typography.body, { color: theme.auth.text, marginRight: 10 }]}> Dark Mode </Text> 
                        <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#767577', true: '#81b0ff' }} thumbColor={isDark ? "#59512e" : '#FAF3E0'} /> 
                    </View> 
                    <Divider /> 
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10}}> 
                        <Text style={[Typography.body, { color: theme.auth.text, marginRight: 10 }]}> Notifications </Text> 
                    </View> 
                </View> 
            </ScrollView> 
        </SafeAreaView> 
    ) 
} 

export default SettingsScreen;