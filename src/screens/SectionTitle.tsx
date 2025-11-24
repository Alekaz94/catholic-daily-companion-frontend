import { useAppTheme } from "../hooks/useAppTheme";
import { useTypography } from "../styles/Typography";
import { Text } from 'react-native';

const SectionTitle = ({ children }: { children: string }) => {
  const theme = useAppTheme();
  const Typography = useTypography();

  return (
    <Text
      style={[
        Typography.italic,
        {
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