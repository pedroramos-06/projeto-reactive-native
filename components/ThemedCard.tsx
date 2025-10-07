import { StyleSheet, useColorScheme, View } from "react-native";
import { Colors } from "../constants/Colors";

import type { StyleProp, ViewProps, ViewStyle } from "react-native";

interface ThemeCardProps extends ViewProps {
  style?: StyleProp<ViewStyle>
}

const ThemeCard = ({style, ...props}: ThemeCardProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] ;

  return (
    <View 
      style = {[{backgroundColor: theme.uiBackground}, styles.card, style]}
      {...props}
    />
  )
}

export default ThemeCard

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 20
  }
})