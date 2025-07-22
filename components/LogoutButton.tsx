import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
    const {logout} = useAuth();

    const handleLogout = async () => {
        await logout();
        alert('Logout successfull!');
    }

    return (
        <TouchableOpacity style={styles.Button} onPress={handleLogout}>
            <Text style={styles.ButtonText}> Logout</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    Button: {
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
      },
      ButtonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
      },
})

export default LogoutButton;