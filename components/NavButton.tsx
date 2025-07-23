import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import { AuthStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Layout } from "../styles/Layout";

type Props = {
    title: string;
    screen: keyof AuthStackParamList;
}

const NavButton: React.FC<Props> = ({ title, screen }: { title: string; screen: keyof AuthStackParamList }) => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    return (
        <TouchableOpacity style={Layout.navbarButton} onPress={() => navigation.navigate(screen)}>
            <Text style={Layout.navbarButtonText}>{title}</Text>
        </TouchableOpacity>
    );
  };

  export default NavButton;
  