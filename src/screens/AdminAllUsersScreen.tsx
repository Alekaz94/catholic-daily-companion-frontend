import { SafeAreaView } from "react-native-safe-area-context"
import { useAppTheme } from "../hooks/useAppTheme"
import Navbar from "../components/Navbar";
import { Layout } from "../styles/Layout";
import { Colors } from "../styles/colors";
import { useTypography } from "../styles/Typography";
import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from "react-native-gesture-handler";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { User } from "../models/User";
import { getAllUsers, searchUser } from "../services/UserService";
import Divider from "../components/Divider";
import { useTheme } from "../context/ThemeContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { AdminUserOverviewDto } from "../models/AdminOverView";

type AdminAllUsersNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminAllUsersScreen"
>

const AdminAllUsersScreen = () => {
    const theme = useAppTheme();
    const user = useRequireAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const size = 10;
    const listRef = useRef<FlatList>(null);
    const navigation = useNavigation<AdminAllUsersNavigationProp>();
    const Typography = useTypography();
    const { isDark } = useTheme();

    if(!user) {
        return null;
    }
    
    const fetchUsers = async () => {
        if(loading || !hasMore) {
            return;
        }
        setLoading(true);
        try {
            const result = isSearching
                ? await searchUser(searchQuery, page, size)
                : await getAllUsers(page, size);

            setUsers(prev => [
                ...prev,
                ...result.content.filter((u: User) => !prev.some(p => p.id === u.id))
            ]);

            setHasMore(!result.last);
        } catch (error) {
            console.error("Failed to load users ", error);
        } finally {
            setLoading(false);
        }
    }
    
    const handleSearch = () => {
        if(searchQuery.trim() === "") {
            return;
        }

        setIsSearching(true);
        setUsers([]);
        setPage(0);
        setHasMore(true);
        listRef.current?.scrollToOffset({offset: 0, animated: true});
    }

    const clearSearch = () => {
        setSearchQuery("");
        setIsSearching(false);
        setUsers([]);
        setPage(0);
        setHasMore(true);
        listRef.current?.scrollToOffset({offset: 0, animated: true});
    }

    useEffect(() => {
        fetchUsers();
      }, [page, isSearching, user]);

      useEffect(() => {
        if (searchQuery.trim() === "") {
          clearSearch();
        }
      }, [searchQuery, user]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.background}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: theme.auth.background}]}>
                <Text style={[Typography.title, {fontSize: 22, marginBottom: 10, color: theme.auth.text}]}>All Registered Users</Text>
                <Divider />
                <View style={[Layout.searchInputView, {marginTop: 10}]}>
                    <Ionicons name="search-outline" size={20} color="#888" style={{ marginRight: 8 }} />
                    <TextInput
                        placeholder="Search by email..."
                        value={searchQuery}
                        onChangeText={value => setSearchQuery(value)}
                        onSubmitEditing={handleSearch}
                        style={Layout.searchInputTextInput} 
                        placeholderTextColor={isDark ? "black" : "white"}
                    />
                    {searchQuery !== "" && (
                        <TouchableOpacity onPress={clearSearch}>
                            <Ionicons name="close-circle" size={20} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
                {loading ? <Text style={{color: theme.auth.text}}>Loading...</Text> : (
                    <FlatList 
                        data={users}
                        ref={listRef}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("AdminUserOverview", { userId: item.id });
                                }}
                                style={[Layout.button, { marginBottom: 10, borderColor: theme.auth.text, backgroundColor: theme.auth.primary}]}>
                                <Text style={[Typography.label, {color: theme.auth.text}]}>{item.email}</Text>
                                <Text style={[Typography.body, {color: theme.auth.text}]}>Role: {item.role}</Text>
                            </TouchableOpacity>
                        )}
                        onEndReached={() => {
                            setPage(prev => prev + 1)
                        }}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={loading ? 
                            (<Text style={{color: theme.auth.text}}>Loading...</Text>) 
                        : !hasMore 
                        ? (<Text style={{textAlign: 'center', marginTop: 10, color: theme.auth.text}}>No more users to load</Text>) 
                        : null}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default AdminAllUsersScreen;