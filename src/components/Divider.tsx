import { View } from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";

const Divider = () => {
  const theme = useAppTheme();

  return ( 
    <View style={{
      height: 1,
      backgroundColor: theme.divider.primary,
      marginVertical: 10,
      marginHorizontal: 16
    }} />
  )
};

export default Divider;