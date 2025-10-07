import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

import type {
  PressableProps,
  StyleProp,
  ViewStyle,
  PressableStateCallbackType,
} from "react-native";

interface ThemedButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
}

function ThemedButton({ style, ...props }: ThemedButtonProps) {
  return (
    <Pressable
      style={({ pressed }: PressableStateCallbackType) => [
        styles.btn,
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.5,
  },
});

export default ThemedButton;
