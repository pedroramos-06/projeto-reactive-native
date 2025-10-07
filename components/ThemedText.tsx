import { Text, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";

import type { TextProps, StyleProp, TextStyle } from "react-native";

interface ThemedTextProps extends TextProps {
  style?: StyleProp<TextStyle>
  title?: boolean
}

const ThemedText = ({style, title=false, ...props}: ThemedTextProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] ;

  const textColor = title ? theme.title : theme.text;

  return(
    <Text
      style={[{color: textColor}, style]}
      {...props}
    />
  )
}

export default ThemedText