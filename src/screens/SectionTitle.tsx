import { useAppTheme } from "../hooks/useAppTheme";
import { Typography } from "../styles/Typography";
import { Text } from 'react-native';

const SectionTitle = ({ children }: { children: string }) => {
  const theme = useAppTheme();

  return (
    <Text
      style={[
        Typography.italic,
        {
          fontSize: 18,
          fontWeight: "600",
          marginTop: 10,
          marginBottom: 0,
          marginHorizontal: 16,
          color: theme.auth.text,
        },
    ]}
    >
      {children}
    </Text>
  )
};

export default SectionTitle;