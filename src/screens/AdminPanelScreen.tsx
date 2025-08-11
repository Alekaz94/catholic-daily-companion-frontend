import { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import { User } from "../models/User";
import { deleteUser, getAllUsers, searchUser } from "../services/UserService";
import Navbar from "../components/Navbar";
import { Layout } from "../styles/Layout";
import { AppTheme, Colors } from "../styles/colors";
import { Typography } from "../styles/Typography";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from "react-native-gesture-handler";

type AdminNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "AdminPanel"
>

const AdminPanelScreen = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [isVisibleDelete, setIsVisibleDelete] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const size = 10;
    const listRef = useRef<FlatList>(null);
    const navigation = useNavigation<AdminNavigationProp>();

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id))
            setIsVisibleDelete(false);
            setUserToDeleteId(null)
        } catch (error) {
            console.error("Failed to delete user ", error);
        }
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
      }, [page, isSearching]);

      useEffect(() => {
        if (searchQuery.trim() === "") {
          clearSearch();
        }
      }, [searchQuery]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#FAF3E0"}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: AppTheme.auth.background}]}>
                <Text style={[Typography.title, {justifyContent: "center", alignSelf: "center"}]}>Admin panel</Text>
                <Text style={[Typography.label, {marginBottom: 10}]}>All Registered Users</Text>
                <TextInput
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChangeText={value => setSearchQuery(value)}
                    onSubmitEditing={handleSearch}
                    style={Layout.input}
                />
                <TouchableOpacity style={{ marginBottom: 10, marginTop: -5 }} onPress={clearSearch}>
                    <Text style={Typography.link}>Clear search</Text>
                </TouchableOpacity>
                {loading ? <Text>Loading...</Text> : (
                    <FlatList 
                        data={users}
                        ref={listRef}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={[Layout.card, { marginBottom: 10 }]}>
                                <Text style={Typography.label}>{item.email}</Text>
                                <Text style={[Typography.body, {color: "black"}]}>Role: {item.role}</Text>
                                <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
                                    <TouchableOpacity onPress={() => {
                                        setIsVisibleDelete(true);
                                        setUserToDeleteId(item.id);
                                    }}>
                                        <Ionicons name="trash-outline" size={20} color="red" />
                                    </TouchableOpacity>  
                                </View>
                            </View>
                        )}
                        onEndReached={() => {
                            setPage(prev => prev + 1)
                        }}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={loading ? 
                            (<Text>Loading...</Text>) 
                        : !hasMore 
                        ? (<Text style={{textAlign: 'center', marginTop: 10}}>No more users to load</Text>) 
                        : null}
                    />
                )}
            </View>

            <Modal
                animationType="fade"
                transparent
                visible={isVisibleDelete}
                onRequestClose={() => setIsVisibleDelete(false)}
            >
                 <View style={[Layout.container, {width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.4)'}]}>
                    <View style={{alignItems: "center", padding: 20, width: "80%", backgroundColor: AppTheme.journal.background, borderRadius: 12, borderColor: "black", borderWidth: 1}}>
                        <Text style={[Typography.body, {color: "black"}]}>Are you sure you want to delete {users.find(user => user.id === userToDeleteId)?.email}?</Text>
                        <View style={{flexDirection: "row"}}>
                            <TouchableOpacity
                                style={[Layout.button, {backgroundColor: Colors.success, width: "30%", marginRight: 20}]}
                                onPress={() => {
                                    if (userToDeleteId) {
                                    handleDelete(userToDeleteId);
                                  }}    
                                }
                            >
                                <Text style={Typography.body}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[Layout.button, {backgroundColor: "gray", width: "30%"}]}
                                onPress={() => setIsVisibleDelete(false)}
                            >
                                <Text style={Typography.body}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

export default AdminPanelScreen;