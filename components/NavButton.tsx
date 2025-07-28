import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Layout } from "../styles/Layout";

type Props = {
    title: string;
    screen: keyof AuthStackParamList;
    style?: object;
    textStyle?: object;
}

const NavButton: React.FC<Props> = ({ title, screen, style, textStyle }) => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    return (
        <TouchableOpacity style={[Layout.navbarButton, style]} onPress={() => navigation.navigate(screen)}>
            <Text style={[Layout.navbarButtonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
  };

  export default NavButton;
  