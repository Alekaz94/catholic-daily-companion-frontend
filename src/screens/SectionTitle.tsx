import { Typography } from "../styles/Typography";
import { Text } from 'react-native';

const SectionTitle = ({ children }: { children: string }) => (
    <Text style={[Typography.italic, { marginTop: 10, marginHorizontal: 16 }]}>
      {children}
    </Text>
);

export default SectionTitle;