import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
    title: string;
    screen: keyof AuthStackParamList;
}

const NavButton: React.FC<Props> = ({ title, screen }: { title: string; screen: keyof AuthStackParamList }) => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    return (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(screen)}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
      },
      buttonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
      },
})

  export default NavButton;
  