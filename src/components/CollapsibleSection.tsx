import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";

interface Props {
    title: string;
    children: React.ReactNode;
    color?: string;
}

const CollapsibleSection: React.FC<Props> = ({ title, children, color = "#000" }) => {
    const [open, setOpen] = useState(false);
    const theme = useAppTheme();

    const toggle = () => {
        setOpen(prev => !prev);
    };

    return (
        <View style={{ marginTop: 20, borderTopWidth: 1, borderColor: theme.auth.text, paddingTop: 10 }}>
            <TouchableOpacity
                onPress={toggle}
                style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10}}
            >
                <Text style={{ fontSize: 16, fontWeight: "bold", color }}>
                    {title}
                </Text>
                <Ionicons
                    name={open ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={color}
                />
            </TouchableOpacity>
            {open && <View style={{ marginTop: 10 }}>{children}</View>}
        </View>
    )
}

export default CollapsibleSection;