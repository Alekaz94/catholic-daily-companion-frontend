import { Text, ScrollView, TouchableOpacity, View } from "react-native";
import Navbar from "../components/Navbar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../hooks/useAppTheme";
import { useTypography } from "../styles/Typography";
import Divider from "../components/Divider";
import { Layout } from "../styles/Layout";
import { useRequireAuth } from "../hooks/useRequireAuth";

type AdminNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminPanel"
>

const AdminPanelScreen = () => {
    const theme = useAppTheme();
    const user = useRequireAuth();
    const navigation = useNavigation<AdminNavigationProp>();
    const Typography = useTypography();

    if(!user) {
        return null;
    }
    
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.background}}>
            <ScrollView 
                style={{backgroundColor: theme.auth.background}}
            >
                <Navbar />
                <Text style={[Typography.title, {textAlign: "center", fontSize: 22, fontWeight: "600", marginTop: 20, color: theme.auth.text}]}>Admin panel</Text>
                
                <Divider />
                <View style={Layout.container}>
                    <Text style={[Typography.italic, {textAlign: "center", fontSize: 22, marginTop: 10, color: theme.auth.text}]}>All Users</Text>
                    <TouchableOpacity 
                        style={[Layout.button, {marginTop: 15, backgroundColor: theme.auth.navbar, width: "50%", justifyContent: "center", alignSelf: "center", marginVertical: 10}]} 
                        onPress={() => navigation.navigate("AdminAllUsersScreen")}
                    >
                        <Text style={[Layout.buttonText, {color: theme.auth.text, textAlign: "center"}]}>Users</Text>
                    </TouchableOpacity>
                </View>

                <Divider />
                <View style={Layout.container}>
                    <Text style={[Typography.italic, {textAlign: "center", fontSize: 22, marginTop: 10, color: theme.auth.text}]}>Feedback from Users</Text>
                    <TouchableOpacity 
                        style={[Layout.button, {marginTop: 15, backgroundColor: theme.auth.navbar, width: "50%", justifyContent: "center", alignSelf: "center", marginVertical: 10}]} 
                        onPress={() => navigation.navigate("AdminFeedbackScreen")}
                    >
                        <Text style={[Layout.buttonText, {color: theme.auth.text, textAlign: "center"}]}>Feedback</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default AdminPanelScreen;