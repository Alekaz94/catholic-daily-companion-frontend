import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { User } from "../models/User";
import { getAllUsers } from "../services/UserService";
import Navbar from "../components/Navbar";
import { Layout } from "../styles/Layout";
import { AppTheme } from "../styles/colors";
import { Typography } from "../styles/Typography";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

type AdminNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminPanel"
>

const AdminPanelScreen = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<AdminNavigationProp>();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#FAF3E0"}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: AppTheme.auth.background}]}>
                <Text style={[Typography.title, {justifyContent: "center", alignSelf: "center"}]}>Admin panel</Text>
                <Text style={[Typography.label, {marginBottom: 10}]}>All Registered Users</Text>
                {loading ? <Text>Loading...</Text> : (
                    <FlatList 
                        data={users}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                          <View style={[Layout.card, { marginBottom: 10 }]}>
                            <Text style={Typography.label}>{item.email}</Text>
                            <Text style={[Typography.body, {color: "black"}]}>Role: {item.role}</Text>
                          </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

export default AdminPanelScreen;