import { View, Text } from "react-native";
import { Typography } from "../styles/Typography";
import { AppTheme } from "../styles/colors";

const SaintFactRow = ({
    label,
    value,
    multiline = false,
  }: {
    label: string;
    value: string;
    multiline?: boolean;
  }) => (
    <View style={{ marginBottom: 8 }}>
        <Text style={[Typography.body, { fontWeight: "600", color: AppTheme.saint.text }]}>{label}</Text>
        <Text style={[Typography.body, { color: AppTheme.saint.text, marginLeft: 4 }]}>{value}</Text>
    </View>
)

export default SaintFactRow;