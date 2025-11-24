import { View, Text } from "react-native";
import { Typography } from "../styles/Typography";
import { useAppTheme } from "../hooks/useAppTheme";

const SaintFactRow = ({
    label,
    value,
    multiline = false,
  }: {
    label: string;
    value: string;
    multiline?: boolean;
  }) => {
    const theme = useAppTheme();

    return (
      <View style={{ marginBottom: 8 }}>
          <Text style={[Typography.body, { fontWeight: "600", color: theme.saint.text, fontSize: 18 }]}>{label}</Text>
          <Text style={[Typography.body, { color: theme.saint.text, marginLeft: 4, fontSize: 16 }]}>{value}</Text>
      </View>
    )
  }

export default SaintFactRow;