import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { useAuth } from '../context/AuthContext';
import { Layout } from "../styles/Layout";

const LogoutButton = () => {
    const {logout} = useAuth();

    const handleLogout = async () => {
        await logout();
        alert('Logout successfull!');
    }

    return (
        <TouchableOpacity style={Layout.navbarButton} onPress={handleLogout}>
            <Text style={Layout.navbarButtonText}> Logout</Text>
        </TouchableOpacity>
    )
}

export default LogoutButton;