import { View, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ViewProps, StyleProp, ViewStyle } from 'react-native';

interface ThemedViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>
  safe?: boolean
}

const ThemedView = ({style, safe=false, ...props}: ThemedViewProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  if(!safe) return (
    <View 
    style = {[{backgroundColor: theme.background}, style]}
    {...props}
    />
  )

  const insets = useSafeAreaInsets()

   return (
    <View 
    style = {[{
      backgroundColor: theme.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }, 
      style]}
    {...props}
    />
   )
}
export default ThemedView