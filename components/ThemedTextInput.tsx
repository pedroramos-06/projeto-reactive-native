import { TextInput, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'

import type { TextInputProps, StyleProp, TextStyle } from 'react-native'

interface ThemedTextInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>
}

const ThemedTextInput = ({ style, ...props }: ThemedTextInputProps) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme ?? 'light']

  return (
    <TextInput 
      style= {[
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,
          padding: 20,
          borderRadius: 6
        },
        style
      ]}
      placeholderTextColor="gray"
      {...props}
    />
  )
}

export default ThemedTextInput
