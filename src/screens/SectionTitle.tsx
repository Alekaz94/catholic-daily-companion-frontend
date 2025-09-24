import { Typography } from "../styles/Typography";
import { Text } from 'react-native';

const SectionTitle = ({ children }: { children: string }) => (
    <Text
      style={[
        Typography.italic,
        {
          fontSize: 18,
          fontWeight: "600",
          marginTop: 10,
          marginBottom: 0,
          marginHorizontal: 16,
          color: "#374151",
        },
    ]}
    >
      {children}
    </Text>
);

export default SectionTitle;